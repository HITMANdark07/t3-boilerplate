import "../styles/globals.css";
import type { AppType } from "next/app";
import { initializeApp } from "firebase/app";
import NextNProgress from "nextjs-progressbar";

import { api } from "~/utils/api";
import { firebaseConfig } from "~/firebase";

const MyApp: AppType = ({ Component, pageProps }) => {
  initializeApp(firebaseConfig);
  return (
    <>
      <NextNProgress
        color="#864ffb"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
