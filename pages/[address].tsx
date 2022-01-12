import type { NextPage } from "next";
import Head from "next/head";
import ProfileBannerImg from "../public/profileBanner.png";
import Banner from "../components/banner";
import Avatar from "../components/avatar";
import LinkWrapper from "../components/link";
import KPI from "../components/kpi";
import Status from "../components/status";
import Table from "../components/table";

import {
  FaWallet,
  FaChartBar,
  FaSquareFull,
  FaRegCopy,
  FaHeart,
} from "react-icons/fa";
import { RiRadarFill } from "react-icons/ri";
import {
  getBlockAddress,
  getCritterzCount,
  getPlayerInfo,
  getPlotsCount,
} from "./api/services";
import Chart from "../components/chart";

function getTotalBlock(block: any) {
  let totalBlock = 0;
  if (block.wallet) {
    totalBlock += parseFloat(
      block.wallet.balance.slice(0, -18) + "." + block.wallet.balance.slice(-18)
    );
  }

  if (block.toClaim) {
    totalBlock += block.toClaim.playReward;

    for (const renter in block.toClaim.rentalRewards) {
      totalBlock += block.toClaim.rentalRewards[renter];
    }
  }

  return totalBlock;
}

function getTotalPlots(plots: any, address: string) {
  let totalOwnedPlots = 0;
  let totalRentedPlots = 0;

  totalOwnedPlots += plots.plot.total;

  if (plots.sPlot.result) {
    plots.sPlot.result.forEach((plot: any) => {
      if (plot.owner_of.toLowerCase() === address.toLowerCase()) {
        totalOwnedPlots++;
      } else totalRentedPlots++;
    });
  }

  return {
    totalOwnedPlots,
    totalRentedPlots,
  };
}

const Overview: NextPage = ({ data }) => {
  return (
    <div className="font-mono text-offwhite flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>
          Critterz Tracker:{" "}
          {data.address.slice(0, 5) + "..." + data.address.slice(-4)}
        </title>
        <meta name="description" content="track your critterz journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center w-full h-full min-h-screen max-w-8xl">
        {/* HERO */}
        <Banner src={ProfileBannerImg} />
        <Avatar src={data.profile.avatar} />

        {/* PROFILE NAME */}
        <div className="relative overflow-hidden flex items-center -mt-6 bg-darkgreen px-3 py-2 border border-gray-700 text-xl rounded-2xl">
          {data.profile.containsMCInfo === false &&
            data.profile.address.slice(0, 5) +
              "..." +
              data.profile.address.slice(-4)}

          {data.profile.containsMCInfo !== false && data.profile.name}
        </div>

        {/* ADDRESS */}
        <p
          className="mt-2 text-xs text-gray-700 flex items-center hover:underline cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(data.profile.address);
          }}
        >
          {" "}
          {data.profile.address.slice(0, 5) +
            "..." +
            data.profile.address.slice(-4)}{" "}
          <FaRegCopy />
        </p>

        <Status
          logoutTimestamp={data.profile.logoutTimestamp}
          timePerEpoch={data.profile.timePerEpoch}
        />

        <div className="w-5/6">
          {/* Account Overview */}
          <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
            <FaChartBar />
            &nbsp;account overview.
          </p>

          <div className="flex flex-wrap justify-end">
            {data.critterz.totalOwned !== 0 && (
              <KPI
                value={data.critterz.totalOwned.toFixed(0)}
                unit="critterz"
                description="# owned"
              />
            )}
            {data.critterz.totalLeased !== 0 && (
              <KPI
                value={data.critterz.totalLeased.toFixed(0)}
                unit="critterz"
                description="# leased"
              />
            )}
            {data.critterz.totalUnstakedOwned !== 0 && (
              <KPI
                value={data.critterz.totalUnstakedOwned.toFixed(0)}
                unit="critterz"
                description="# unstaked"
              />
            )}
            {data.critterz.totalRented !== 0 && (
              <KPI
                value={data.critterz.totalRented.toFixed(0)}
                unit="critterz"
                description="# rented"
              />
            )}
            {data.plots.totalOwned !== 0 && (
              <KPI
                value={data.plots.totalOwned.toFixed(0)}
                unit="plots"
                description="# owned"
              />
            )}
            {data.plots.totalLeased !== 0 && (
              <KPI
                value={data.plots.totalLeased.toFixed(0)}
                unit="plots"
                description="# leased"
              />
            )}
            {data.plots.totalUnstakedOwned !== 0 && (
              <KPI
                value={data.plots.totalUnstakedOwned.toFixed(0)}
                unit="plots"
                description="# unstaked"
              />
            )}
            {data.plots.totalRented !== 0 && (
              <KPI
                value={data.plots.totalRented.toFixed(0)}
                unit="plots"
                description="# rented"
              />
            )}
            <KPI
              value={getTotalBlock(data.block).toFixed(2)}
              unit="$block"
              description="total $block"
            />
            <KPI value={"-"} unit="$USD" description="net worth est." />
          </div>
          <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
            <FaChartBar />
            &nbsp;performance breakdown.
          </p>
          <div className="border border-gray-700">
            <Chart timePerEpoch={data.profile.timePerEpoch} />
            <Table
              profile={data.profile}
              address={data.address}
              blockInfo={data.block}
              critterzInfo={data.critterz}
            />
          </div>

          <p className=" flex justify-end items-center text-sm m-1 text-right mt-10">
            <FaHeart />
            &nbsp;created by nabs.eth.
          </p>
          <p className=" flex justify-end items-center text-sm m-1 mb-10 text-right">
            Nabs#2157.
          </p>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { address } = params;

  try {
    const block = await getBlockAddress(address);
    const critterz = await getCritterzCount(address);
    const plots = await getPlotsCount(address);
    const profile = await getPlayerInfo(address);

    return {
      props: {
        data: {
          block,
          critterz,
          plots,
          address,
          profile,
        },
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}

export default Overview;
