import { type NextPage } from "next";
import Head from "next/head";
import { ImWink2 } from "react-icons/im";

import PublicLayout from "~/components/layout/PublicLayout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Boilerplate App</title>
      </Head>
      <PublicLayout>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mt-20 text-4xl font-bold">Hello T3 Stack</div>
          <ImWink2 size={60} className="mt-10" />
        </div>
      </PublicLayout>
    </>
  );
};

export default Home;
