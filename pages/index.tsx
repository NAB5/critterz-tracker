import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import MainBannerImg from "../public/MainBanner.png";
import CritterzImg from "../public/critterz.gif";
import Banner from "../components/banner";
import Avatar from "../components/avatar";
import SearchBar from "../components/searchBar";
import LinkWrapper from "../components/link";
import KPI from "../components/kpi";
import axios from "axios";
import {
  FaChartBar,
  FaHeart,
  FaLink,
  FaBook,
  FaDiscord,
  FaTwitter,
  FaMap,
  FaGlobe,
  FaCode,
  FaMapMarkedAlt,
  FaPaintBrush,
  FaHandshake,
} from "react-icons/fa";

import { RiRadarFill } from "react-icons/ri";
import {
  getBlockPrice,
  getCritterzStats,
  getPlotsPrice,
  getPlotsStats,
} from "./api/services";

const Home: NextPage = ({ data }) => {
  return (
    <div className="font-mono text-offwhite flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Critterz Tracker</title>
        <meta name="description" content="track your critterz journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center w-full h-full min-h-screen max-w-8xl">
        <Banner src={MainBannerImg} />
        <Avatar src={CritterzImg} />
        <div className="relative overflow-hidden flex items-center -mt-6 bg-darkgreen px-3 py-2 border border-gray-700 text-xl rounded-2xl">
          <RiRadarFill />
          &nbsp;Critterz Tracker
        </div>

        <div className="w-5/6">
          <p className=" flex justify-end items-center text-sm m-1 text-right mt-10">
            <FaBook />
            &nbsp;overview of your critterz journey.
          </p>
          <SearchBar placeholder="Enter Address..." />

          {/* STATS */}
          <p className=" flex justify-end items-center text-sm m-1 text-right mt-10">
            <FaChartBar />
            &nbsp;critterz statistics.
          </p>

          <div className="flex flex-wrap justify-end">
            <KPI
              value={data.critterz.stats.floor_price.toFixed(2)}
              unit="Ξ"
              description="critterz floor price"
            />
            <KPI
              value={data.plots.stats.floor_price.toFixed(2)}
              unit="Ξ"
              description="plot floor price"
            />
            <KPI
              value={data.block.usdPrice.toFixed(2)}
              unit="$/BLOCK"
              description="block price"
            />
            <KPI
              value={data.plots.price.toFixed(2)}
              unit="$BLOCK"
              description="claim plot price"
            />
            <KPI
              value={(
                (data.critterz.stakedCount / data.critterz.stats.count) *
                100
              ).toFixed(2)}
              unit="%"
              description="% staked"
            />
          </div>

          {/* OFFICIAL LINKS */}
          <p className=" flex justify-end items-center text-sm m-1 text-right mt-10">
            <FaLink />
            &nbsp;official links.
          </p>

          <div className="flex flex-wrap justify-end">
            <LinkWrapper
              text="official website"
              link="https://www.critterz.xyz/"
              Icon={FaGlobe}
            />
            <LinkWrapper
              text="discord"
              link="https://discord.com/invite/qvKeaf5F2d"
              Icon={FaDiscord}
            />
            <LinkWrapper
              text="twitter"
              link="https://twitter.com/critterznft"
              Icon={FaTwitter}
            />
            <LinkWrapper
              text="roadmap"
              link="https://roadmap.critterz.xyz/"
              Icon={FaMapMarkedAlt}
            />
            <LinkWrapper
              text="genesis critterz (os)"
              link="https://opensea.io/collection/critterznft"
              Icon={FaPaintBrush}
            />
            <LinkWrapper
              text="critterz plots (os)"
              link="https://opensea.io/collection/critterzplots"
              Icon={FaPaintBrush}
            />
            <LinkWrapper
              text="server map"
              link="https://map.critterz.xyz/"
              Icon={FaMap}
            />
            <LinkWrapper
              text="$block dexscreener"
              link="https://dexscreener.com/ethereum/0xe93527d1f8c586353b13826c501fa5a69bce2b0e"
              Icon={FaHandshake}
            />
            <LinkWrapper
              text="contracts"
              link="https://docs.google.com/document/d/1YHp1rUfxlWz64YimxtjTojALUMaYqMLTHU39TEMj9zI/edit"
              Icon={FaCode}
            />
          </div>

          <p className=" flex justify-end items-center text-sm m-1 text-right mt-10">
            <FaHeart />
            &nbsp;created by nabs.eth.
          </p>
          <p className=" flex justify-end items-center text-sm m-1 text-right">
            Nabs#2157.
          </p>
        </div>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const block = await getBlockPrice();
    const critterz = await getCritterzStats();
    const plots = await getPlotsStats();
    const plotPrice = await getPlotsPrice();

    const data = {
      block: block,
      critterz: critterz,
      plots: {
        ...plots,
        ...plotPrice,
      },
    };

    return {
      props: { data }, // will be passed to the page component as props
      revalidate: 60, // In seconds
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default Home;
