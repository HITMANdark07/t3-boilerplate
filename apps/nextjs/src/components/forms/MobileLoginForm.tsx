/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useState, type FC } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

import { api } from "~/utils/api";
import Button from "../common/Button";

type FormEvent = React.MouseEvent<HTMLFormElement>;

//@Shekhar - please include react hook form here.
const MobileLogin: FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [final, setFinal] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = getAuth();
  const router = useRouter();
  const { isFetching } = api.user.getUserByEmailorPhone.useQuery(phone);

  const signInWithPhone = async () => {
    try {
      const verify = new RecaptchaVerifier("sign-in-button", {}, auth);
      const resp = await signInWithPhoneNumber(auth, "+91" + phone, verify);
      setFinal(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmOtp = async (e: FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (otp.trim() === "" || final === null) {
        return;
      }
      const otpConfirmation: any = await final.confirm(otp);
      setCookie("accessToken", otpConfirmation.user.accessToken);
      setCookie("refreshToken", otpConfirmation.user.refreshToken);
      await router.push("/users");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updatePhone = (value: string) => {
    setPhone(value);
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const debounce = useCallback((fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  }, []);
  const debouncedUpdatePhone = debounce(updatePhone);

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    // if (["ADMIN", "ORGANIZATION"].includes(data?.role as string)) {
    void signInWithPhone();
    // }
  };
  return (
    <div className="mx-4 max-h-min w-full min-w-[300px] self-center rounded-lg border bg-slate-700 px-4 py-8 md:mx-0 md:w-1/2">
      {!final ? (
        <form className="flex flex-col gap-2" onSubmit={submitForm}>
          <h2 className="text-center text-2xl text-white">
            Sign in using phone number
          </h2>
          <input
            id="phone"
            type="tel"
            name="phone"
            className="border-bg-gray rounded py-2 px-3 outline-none"
            onChange={(e) => debouncedUpdatePhone(e.target.value)}
            placeholder="Enter your Phone Number"
          />
          <div id="sign-in-button" />
          <Button
            type="submit"
            className="bg-primary-red mt-6 rounded-lg py-2 text-white"
            loading={isFetching}
            // disabled={
            //   !data || !["ADMIN", "ORGANIZATION"].includes(data?.role as string)
            // }
          >
            GET OTP
          </Button>
        </form>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={confirmOtp}>
          <h2 className="text-center text-2xl text-white">Enter OTP</h2>
          <label htmlFor="phone" className="text-lg text-white">
            OTP
          </label>
          <input
            id="otp"
            type="number"
            name="otp"
            value={otp}
            className="border-bg-gray rounded py-2 px-3 outline-none"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <Button
            type="submit"
            className="bg-primary-red mt-6 rounded-lg py-2 text-white"
            loading={loading}
          >
            VERIFY OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default MobileLogin;
