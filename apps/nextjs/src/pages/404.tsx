import { type NextPage } from "next";
import Head from "next/head";
import Lottie from "lottie-react";

import PublicLayout from "~/components/layout/PublicLayout";
import notFoundAnimation from "../assets/404.json";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found (404)</title>
      </Head>
      <PublicLayout>
        <div className="scrollbar-hide flex h-1/2 flex-col items-center justify-center lg:h-screen">
          <Lottie animationData={notFoundAnimation} loop={true} />
        </div>
      </PublicLayout>
    </>
  );
};

export default NotFound;
