import type { NextPage } from "next";
import Head from "next/head";
import ProfileBannerImg from "../public/profileBanner.png";
import Banner from "../components/banner";
import Avatar from "../components/avatar";

import KPI from "../components/kpi";
import TokenCard from "../components/tokenCard";
import Status from "../components/status";
import Table from "../components/table";

import {
  FaChartBar,
  FaRegCopy,
  FaHeart,
  FaHandHolding,
  FaHandHoldingUsd,
  FaCubes,
  FaTag,
} from "react-icons/fa";

import {
  getBlockAddress,
  getCritterzCount,
  getCritterzOwned,
  getCritterzRented,
  getPlayerInfo,
  getPlotsCount,
  getResolvedAddress,
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

    if (block.toClaim.inGameMarketplaceReward)
      totalBlock += block.toClaim.inGameMarketplaceReward;

    if (block.toClaim.offchainTransactionReward)
      totalBlock += block.toClaim.offchainTransactionReward;

    for (const renter in block.toClaim.rentalRewards) {
      totalBlock += block.toClaim.rentalRewards[renter];
    }
  }

  return totalBlock;
}

const Overview: NextPage = ({ data }) => {
  return (
    <div className="font-mono text-offwhite flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>{`${
          data.profile.containsMCInfo
            ? data.profile.name
            : data.profile.address.slice(0, 5) +
              "..." +
              data.profile.address.slice(-4)
        }'s Profile | ${getTotalBlock(data.block).toFixed(0)} $BLOCK`}</title>
        <meta
          name="og:title"
          content={`${data.profile.name}'s Profile | ${getTotalBlock(
            data.block
          ).toFixed(0)} $BLOCK`}
        />
        <meta property="og:image" content={data.profile.avatar} />
        <meta property="twitter:image" content={data.profile.avatar} />
        <meta property="og:url" content="https://www.critterztracker.com" />
        <meta property="og:determiner" content="Critterz Tracker" />
        <meta name="twitter:creator" content="@_Nabs__" />
        {/* <meta name="title" content={`${data.profile.name}'s Profile'`} /> */}
        <meta
          name="twitter:description"
          content={`${data.critterz.totalOwned} Critterz owned. ${data.critterz.totalRented} Critterz Rented. ${data.plots.totalOwned} Plots owned. created by nabs.eth <3`}
        />
        <meta
          name="description"
          content={`${data.critterz.totalOwned} Critterz owned. ${data.critterz.totalRented} Critterz Rented. ${data.plots.totalOwned} Plots owned. created by nabs.eth <3`}
        />
        <meta name="twitter:card" content="summary" />
        <link rel="icon" href="/critterz.gif" />
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
          logoutTimestamp={data.profile.lastLogout}
          timePerEpoch={data.profile.timePerEpoch}
        />

        <div className="w-5/6">
          {/* <hr className="border-gray-900 mt-5" /> */}
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
            {/* <KPI value={"-"} unit="$USD" description="net worth est." /> */}
          </div>

          <hr className="border-gray-700 mt-5" />

          {/* UNSTAKED CRITTERZ */}
          {data.tokenHoldings.critterzOwned.unstaked.length !== 0 && (
            <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
              <FaHandHolding />
              &nbsp;unstaked Critterz.
            </p>
          )}

          <div className="flex flex-row-reverse overflow-x-auto border-l border-gray-700 bg-darkgreen">
            {data.tokenHoldings.critterzOwned.unstaked.map(
              (tokenId: string) => {
                return (
                  <TokenCard
                    key={tokenId}
                    title={`#${tokenId}`}
                    tokenId={tokenId}
                    contract={`${process.env.NEXT_PUBLIC_CRITTERZ_CONTRACT_ADDRESS}`}
                    description="sCritterz"
                  />
                );
              }
            )}
          </div>

          {/* STAKED CRITTERZ */}
          {data.tokenHoldings.critterzOwned.staked.length !== 0 && (
            <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
              <FaHandHoldingUsd />
              &nbsp;staked Critterz.
            </p>
          )}

          <div className="flex flex-row-reverse overflow-x-auto border-l border-gray-700 bg-darkgreen">
            {data.tokenHoldings.critterzOwned.staked.map((tokenId: string) => {
              return (
                <TokenCard
                  key={tokenId}
                  title={`#${tokenId}`}
                  tokenId={tokenId}
                  contract={`${process.env.NEXT_PUBLIC_SCRITTERZ_CONTRACT_ADDRESS}`}
                  description="sCritterz"
                />
              );
            })}
          </div>

          {/* RENTED CRITTERZ */}
          {data.tokenHoldings.critterzRented.tokens.length !== 0 && (
            <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
              <FaTag />
              &nbsp;leased Critterz.
            </p>
          )}

          <div className="flex flex-row-reverse overflow-x-auto border-l border-gray-700 bg-darkgreen">
            {data.tokenHoldings.critterzRented.tokens.map((tokenId: string) => {
              return (
                <TokenCard
                  key={tokenId}
                  title={`#${tokenId}`}
                  tokenId={tokenId}
                  contract={`${process.env.NEXT_PUBLIC_SCRITTERZ_CONTRACT_ADDRESS}`}
                  description="sCritterz"
                />
              );
            })}
          </div>

          <hr className="border-gray-700 mt-10" />

          <p className=" flex justify-end items-center text-sm m-1 text-right mt-5">
            <FaCubes />
            &nbsp;playtime/$BLOCK performance breakdown.
          </p>
          <div className="border border-gray-700">
            <Chart timePerEpoch={data.profile.timePerEpoch} />
            <div className="max-h-72 overflow-auto">
              <Table
                profile={data.profile}
                address={data.address}
                blockInfo={data.block}
                critterzInfo={data.critterz}
                critterzRented={data.tokenHoldings.critterzRented.tokens}
              />
            </div>
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
  let { address } = params;

  try {
    const resolved = await getResolvedAddress(address);
    address = resolved.address;

    const block = await getBlockAddress(address);
    const critterz = await getCritterzCount(address);
    const critterzRented = await getCritterzRented(address);
    const critterzOwned = await getCritterzOwned(address);
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
          tokenHoldings: {
            critterzOwned,
            critterzRented,
          },
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
