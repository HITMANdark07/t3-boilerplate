import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="night" lang="en" className="scrollbar-hide">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
