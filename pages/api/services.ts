import axios from "axios";
import web3 from "web3-utils";
import { request, gql } from "graphql-request";
import dayjs from "dayjs";

let utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

function calculateTime(playerLog: any, currentDay: any) {
  let timePerEpoch = new Array(14).fill(0);

  if (!playerLog.length) return timePerEpoch;

  playerLog.forEach((log: any) => {
    const login = dayjs.utc(log.login_timestamp);
    const logout =
      log.logout_timestamp === null
        ? dayjs.utc()
        : dayjs.utc(log.logout_timestamp);

    if (login.day() !== logout.day()) {
      const temp = login;
      temp
        .day(login.day() + 1)
        .hour(0)
        .minute(0)
        .second(0);
      timePerEpoch[Math.abs(Math.ceil(currentDay.diff(login, "day", true)))] +=
        temp.diff(login, "minute");
    } else
      timePerEpoch[Math.abs(Math.ceil(currentDay.diff(login, "day", true)))] +=
        logout.diff(login, "minute");
  });

  return timePerEpoch;
}

function convertAddressToChecksum(address: string) {
  const checksumAddress = web3.toChecksumAddress(address);

  if (!web3.checkAddressChecksum(checksumAddress)) {
    throw Error("invalid checksum address");
  }

  return checksumAddress;
}

//get $BLOCK holdings for address
export async function getBlockAddress(address: string) {
  address = convertAddressToChecksum(address);

  try {
    const walletHolding = await axios.get(
      `${process.env.MORALIS_WEB3_ENDPOINT}/${address}/erc20?chain=eth&token_addresses=${process.env.BLOCK_CONTRACT_ADDRESS}`,
      {
        headers: {
          "X-API-Key": `${process.env.MORALIS_API_KEY}`,
        },
      }
    );

    const walletData = walletHolding.data;

    const claimHolding = await axios.get(
      `${process.env.CRITTERZ_DATA_ENDPOINT}/block/reward/${address}`
    );
    const claimData = claimHolding.data;
    return {
      wallet: walletData[0] || null,
      toClaim: claimData,
    };
  } catch (e: any) {
    throw e;
  }
}

// get $BLOCK price from sushi swap
export async function getBlockPrice() {
  try {
    const result = await axios.get(
      `${process.env.MORALIS_WEB3_ENDPOINT}/erc20/${process.env.BLOCK_CONTRACT_ADDRESS}/price?chain=eth`,
      {
        headers: {
          "X-API-Key": `${process.env.MORALIS_API_KEY}`,
        },
      }
    );
    return result.data;
  } catch (e: any) {
    throw e;
  }
}

export async function getCritterzCount(address: string) {
  try {
    address = convertAddressToChecksum(address);
    const OwnerTokenCountQuery = gql`
      query StakedOwnerTokenCount(
        $account_address: String!
        $token_address: String!
      ) {
        tokens_of_provenance_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
        tokens_of_owner_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
        tokens_of_renter_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `;

    const stakedData = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      OwnerTokenCountQuery,
      {
        account_address: address,
        token_address: process.env.SCRITTERZ_CONTRACT_ADDRESS,
      }
    );

    const critterzData = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      OwnerTokenCountQuery,
      {
        account_address: address,
        token_address: process.env.CRITTERZ_CONTRACT_ADDRESS,
      }
    );

    return {
      totalOwned:
        stakedData.tokens_of_provenance_aggregate.aggregate.count +
        critterzData.tokens_of_owner_aggregate.aggregate.count,
      totalUnstakedOwned:
        critterzData.tokens_of_owner_aggregate.aggregate.count,
      totalLeased: stakedData.tokens_of_renter_aggregate.aggregate.count,
      totalRented:
        stakedData.tokens_of_owner_aggregate.aggregate.count +
        stakedData.tokens_of_renter_aggregate.aggregate.count -
        stakedData.tokens_of_provenance_aggregate.aggregate.count,
    };
  } catch (e) {
    throw e;
  }
}

export async function getCritterzRented(address: string) {
  try {
    address = convertAddressToChecksum(address);
    const RentedTokensQuery = gql`
      query Tokens_of_renter($args: tokens_of_renter_args!) {
        tokens_of_renter(args: $args) {
          token_id
        }
      }
    `;

    const rentedToken = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      RentedTokensQuery,
      {
        args: {
          _token_address: `${process.env.SCRITTERZ_CONTRACT_ADDRESS}`,
          account_address: `${address}`,
        },
      }
    );

    let toReturn: string[] = [];
    if (rentedToken.tokens_of_renter) {
      toReturn = rentedToken.tokens_of_renter.map((token: any) => {
        return token.token_id;
      });
    }

    return {
      tokens: toReturn,
    };
  } catch (e) {
    throw e;
  }
}

export async function getCritterzOwned(address: string) {
  try {
    address = convertAddressToChecksum(address);
    const OwnerTokensQuery = gql`
      query Tokens_of_renter($args: tokens_of_owner_args!) {
        tokens_of_owner(args: $args) {
          token_id
        }
      }
    `;

    const ownerToken = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      OwnerTokensQuery,
      {
        args: {
          _token_address: `${process.env.SCRITTERZ_CONTRACT_ADDRESS}`,
          account_address: `${address}`,
        },
      }
    );

    let toReturn: string[] = [];
    if (ownerToken.tokens_of_owner) {
      toReturn = ownerToken.tokens_of_owner.map((token: any) => {
        return token.token_id;
      });
    }

    return {
      tokens: toReturn,
    };
  } catch (e) {
    throw e;
  }
}

export async function getCritterzAddress(address: string) {
  try {
    const critterzNFT = await axios.get(
      `${process.env.MORALIS_WEB3_ENDPOINT}/${address}/nft?chain=eth&token_addresses=${process.env.CRITTERZ_CONTRACT_ADDRESS}`,
      {
        headers: {
          "X-API-Key": `${process.env.MORALIS_API_KEY}`,
        },
      }
    );

    const scritterzNFT = await axios.get(
      `${process.env.MORALIS_WEB3_ENDPOINT}/${address}/nft?chain=eth&token_addresses=${process.env.SCRITTERZ_CONTRACT_ADDRESS}`,
      {
        headers: {
          "X-API-Key": `${process.env.MORALIS_API_KEY}`,
        },
      }
    );

    const critterzNFTData = critterzNFT.data;
    const scritterzNFTData = scritterzNFT.data;

    return {
      critterz: critterzNFTData,
      sCritterz: scritterzNFTData,
    };
  } catch (e: any) {
    throw e;
  }
}

export async function getCritterzStats() {
  try {
    const result = await axios.get(
      `https://api.opensea.io/api/v1/collection/critterznft/stats`,
      {
        headers: {
          // "X-API-Key": `${process.env.MORALIS_API_KEY}`
        },
      }
    );
    const stakedResults = await axios.get(
      `https://api.opensea.io/api/v1/collection/staked-critterz/stats`
    );

    return {
      ...result.data,
      stakedCount: stakedResults.data.stats.count,
    };
  } catch (e: any) {
    throw e;
  }
}

export async function getPlotsCount(address: string) {
  try {
    address = convertAddressToChecksum(address);
    const OwnerTokenCountQuery = gql`
      query StakedOwnerTokenCount(
        $account_address: String!
        $token_address: String!
      ) {
        tokens_of_provenance_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
        tokens_of_owner_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
        tokens_of_renter_aggregate(
          args: {
            _token_address: $token_address
            account_address: $account_address
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `;

    const stakedData = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      OwnerTokenCountQuery,
      {
        account_address: address,
        token_address: process.env.SPLOT_CONTRACT_ADDRESS,
      }
    );

    const plotData = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      OwnerTokenCountQuery,
      {
        account_address: address,
        token_address: process.env.PLOT_CONTRACT_ADDRESS,
      }
    );

    return {
      totalOwned:
        stakedData.tokens_of_provenance_aggregate.aggregate.count +
        plotData.tokens_of_owner_aggregate.aggregate.count,
      totalUnstakedOwned: plotData.tokens_of_owner_aggregate.aggregate.count,
      totalLeased: stakedData.tokens_of_renter_aggregate.aggregate.count,
      totalRented:
        stakedData.tokens_of_owner_aggregate.aggregate.count +
        stakedData.tokens_of_renter_aggregate.aggregate.count -
        stakedData.tokens_of_provenance_aggregate.aggregate.count,
    };
  } catch (e) {
    throw e;
  }
}

export async function getPlotsPrice() {
  try {
    const price = await axios.post(
      `${process.env.MORALIS_WEB3_ENDPOINT}/${process.env.PLOT_CONTRACT_ADDRESS}/function?chain=eth&function_name=price`,
      {
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "approved",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "ApprovalForAll",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            inputs: [],
            name: "MAX_DIMENSION",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
            ],
            name: "balanceOf",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "blockAddress",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256[]",
                name: "tokenIds",
                type: "uint256[]",
              },
              { internalType: "bool", name: "stake", type: "bool" },
            ],
            name: "claim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "int256", name: "x", type: "int256" },
              { internalType: "int256", name: "y", type: "int256" },
              { internalType: "bool", name: "stake", type: "bool" },
            ],
            name: "claimCoordinate",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "claimSpawn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "dimension",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "getApproved",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "getPlotCoordinate",
            outputs: [
              { internalType: "int256", name: "", type: "int256" },
              { internalType: "int256", name: "", type: "int256" },
            ],
            stateMutability: "pure",
            type: "function",
          },
          {
            inputs: [
              { internalType: "int256", name: "x", type: "int256" },
              { internalType: "int256", name: "y", type: "int256" },
            ],
            name: "getPlotTokenId",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "pure",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_stakingAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "_blockAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "_metadataAddress",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
              { internalType: "address", name: "operator", type: "address" },
            ],
            name: "isApprovedForAll",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "metadataAddress",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "ownerOf",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "price",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "from", type: "address" },
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "from", type: "address" },
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
              { internalType: "bytes", name: "_data", type: "bytes" },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "operator", type: "address" },
              { internalType: "bool", name: "approved", type: "bool" },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_blockAddress",
                type: "address",
              },
            ],
            name: "setBlockAddress",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "_dimension", type: "uint256" },
            ],
            name: "setDimension",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_metadataAddress",
                type: "address",
              },
            ],
            name: "setMetadataAddress",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_stakingAddress",
                type: "address",
              },
            ],
            name: "setStakingAddress",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            name: "spawns",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "stakingAddress",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
            ],
            name: "supportsInterface",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "tokenURI",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "from", type: "address" },
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "transferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "newOwner", type: "address" },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {},
      },
      {
        headers: {
          "X-API-Key": `${process.env.MORALIS_API_KEY}`,
        },
      }
    );

    let priceData = parseFloat(
      price.data.slice(0, -18) + "." + price.data.slice(-18)
    );

    return {
      price: priceData,
    };
  } catch (e: any) {
    throw e;
  }
}

export async function getPlotsStats() {
  try {
    const result = await axios.get(
      `https://api.opensea.io/api/v1/collection/critterzplots/stats`,
      {
        headers: {
          // "X-API-Key": `${process.env.MORALIS_API_KEY}`
        },
      }
    );
    return result.data;
  } catch (e: any) {
    throw e;
  }
}

export async function getPlayerInfo(address: string) {
  let utcToday = dayjs.utc().hour(0).minute(0).second(0);

  try {
    address = convertAddressToChecksum(address);

    const AccountInfoQuery = gql`
      query Account($where: account_bool_exp) {
        account(where: $where) {
          minecraft_player_uuid
        }
      }
    `;

    const PlayerInfoQuery = gql`
      query PlayerInfo(
        $where: player_log_bool_exp
        $orderBy: [player_log_order_by!]
        $limit: Int
      ) {
        player_log(where: $where, order_by: $orderBy, limit: $limit) {
          login_timestamp
          logout_timestamp
        }
      }
    `;

    const accountInfo = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      AccountInfoQuery,
      {
        where: {
          address: {
            _eq: address,
          },
        },
      }
    );

    const activity = await request(
      process.env.CRITTERZ_GRAPHQL_ENDPOINT as string,
      PlayerInfoQuery,
      {
        where: {
          account_address: {
            _eq: address,
          },
          login_timestamp: {
            _gt: utcToday.subtract(13, "day").format(),
          },
        },
        orderBy: [
          {
            login_timestamp: "desc_nulls_last",
          },
        ],
      }
    );

    if (!accountInfo.account.length) {
      return {
        containsMCInfo: false,
        name: address,
        avatar: "https://crafthead.net/avatar/Notch",
        address,
        timePerEpoch: new Array(14).fill(0),
      };
    }

    const timePerEpoch = calculateTime(activity.player_log, utcToday);

    //capture minecraft info
    try {
      const mcInfo = await axios.get(
        "https://crafthead.net/profile/" +
          accountInfo.account[0].minecraft_player_uuid
      );

      let lastLogout = activity.player_log.length
        ? activity.player_log[0].logout_timestamp
        : "empty";

      return {
        containsMCInfo: true,
        name: mcInfo.data.name,
        avatar:
          "https://crafthead.net/helm/" +
          accountInfo.account[0].minecraft_player_uuid +
          "/128",
        address,
        uuid: accountInfo.account[0].minecraft_player_uuid,
        lastLogout,
        // playerLog: activity.player_log,
        timePerEpoch,
      };
    } catch (e) {
      let lastLogout = activity.player_log
        ? activity.player_log[0].logout_timestamp
        : "empty";

      return {
        containsMCInfo: false,
        username: address,
        avatar: "https://crafthead.net/avatar/Notch",
        address,
        uuid: accountInfo.account[0].minecraft_player_uuid,
        lastLogout,
        // playerLog: activity.player_log,
        timePerEpoch,
      };
    }
  } catch (e) {
    throw e;
  }
}
