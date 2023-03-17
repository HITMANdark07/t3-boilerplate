/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import { type NextApiRequest, type NextApiResponse } from "next";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import axios from "axios";
import { getAuth } from "firebase-admin/auth";
import { type DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import superjson from "superjson";
import { ZodError } from "zod";

import { prisma } from "@app/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type CreateContextOptions = {
  userId: string | null;
  req: NextApiRequest;
  res: NextApiResponse;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    userId: opts.userId,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prisma,
    req: opts.req,
    res: opts.res,
  };
};
export default async function needsLoggedInUser(
  idToken: string,
  refreshToken: string,
): Promise<{
  decodedToken: DecodedIdToken | false;
  validAccessToken: string;
  validRefreshToken: string;
}> {
  try {
    /**
     * Valid case when the auth token is valid
     * Return correct tokens
     * */

    const auth = await getAuth().verifyIdToken(idToken);
    return {
      decodedToken: auth,
      validAccessToken: idToken,
      validRefreshToken: refreshToken,
    };
  } catch (err: any) {
    try {
      /**
       * Case when the auth token is expired
       * Refresh the token and return the correct auth details
       * */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.errorInfo?.code === "auth/id-token-expired") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data } = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
        );
        return await needsLoggedInUser(
          data?.access_token as string,
          data?.refresh_token as string,
        );
      }
    } catch (error) {
      console.log(error, "**************** ERROR ****************");

      /**
       * Error case
       * Return existing tokens and false as decoded token
       * */
      return {
        decodedToken: false,
        validAccessToken: idToken,
        validRefreshToken: refreshToken,
      };
    }
    return {
      /**
       * Error case
       * Return existing tokens and false as decoded token
       * */
      decodedToken: false,
      validAccessToken: idToken,
      validRefreshToken: refreshToken,
    };
  }
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const accessToken = req.cookies["accessToken"] as string;
  const refreshToken = req.cookies["refreshToken"] as string;

  if (!accessToken)
    return createInnerTRPCContext({
      userId: null,
      req: req,
      res: res,
    });

  const { decodedToken } = await needsLoggedInUser(
    accessToken,
    refreshToken || "",
  );

  if (!decodedToken)
    return createInnerTRPCContext({
      userId: null,
      req: req,
      res: res,
    });

  const user = await prisma.user.findFirst({
    where: {
      phone: decodedToken.phone_number,
    },
  });

  if (user) {
    return createInnerTRPCContext({
      userId: user.id,
      req: req,
      res: res,
    });
  }

  return createInnerTRPCContext({
    userId: null,
    req: req,
    res: res,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
