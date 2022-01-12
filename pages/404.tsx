import type { NextPage } from "next";
import Head from "next/head";

import { IoMdArrowBack } from "react-icons/io";
import LinkWrapper from "../components/link";

const Error: NextPage = ({ data }) => {
  return (
    <div className="font-mono text-offwhite flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Critterz: Not Found</title>
        <meta name="description" content="track your critterz journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* MAIN CONTENT */}
      <main className="flex flex-col justify-center items-center w-full h-full min-h-screen max-w-8xl">
        could not find the page you were looking for.
        <br />
        <br />
        <LinkWrapper text="go back" link="/" Icon={IoMdArrowBack} />
      </main>
    </div>
  );
};

export default Error;
