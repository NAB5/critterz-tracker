import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import exp from "constants";

function _expectedBlockOutput(nCritterz: number, playTime: number): number {
  return 24 * nCritterz + Math.sqrt((playTime / 60) * nCritterz) * 100;
}

function expectedBlockOutput(owned: any, rented: any, playTime: any): any {
  if (rented === 0 || owned === 0) return 0;
  return (rented / owned) * (1 / 3) * _expectedBlockOutput(owned, playTime);
}

function getAverage(timePerEpoch: number[], days: number): any {
  let avg = 0;
  for (let i = 0; i < days; i++) {
    avg += timePerEpoch[i];
  }

  return avg / days;
}

const Row = ({
  className = "",
  address,
  critterzRented,
  blockEarned,
}: {
  className?: string;
  address: string;
  ownerAddress: string;
  critterzRented: number[];
  blockEarned: any;
}) => {
  const [playTime, setPlayTime] = useState(0);
  const [username, setUsername] = useState(
    address.slice(0, 5) + "..." + address.slice(-5)
  );
  const [owned, setOwned] = useState(0);
  const [rented, setRented] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/api/profile/${address}`);
        const ownedTokenFetch = await axios.get(
          `/api/critterz/${address}/owned`
        );

        const tokenTotals = await axios.get(`/api/critterz/${address}/count`);
        const totalRented = tokenTotals.data.totalRented;

        const profile = response.data;
        setPlayTime(getAverage(profile.timePerEpoch, 14).toFixed(2));

        const ownedTokens = ownedTokenFetch.data.staked;
        setOwned(totalRented);

        let intersect = ownedTokens.filter((x: any) =>
          critterzRented.includes(x)
        );
        setRented(intersect.length);

        if (profile.containsMCInfo) {
          setUsername(profile.name);
        }

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <tr
      className={`hover:bg-white/5 ${loading ? " opacity-20 " : "opacity-100"}`}
    >
      <td className="pl-4">
        <Link href={`/${address}`}>
          <a
            className="flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="hover:underline cursor-pointer ">
              {username}({rented}/{owned})
            </p>
            &nbsp;
            <FaExternalLinkAlt />
          </a>
        </Link>
      </td>
      <td className="text-center">{blockEarned.toFixed(2)}</td>
      <td className="text-center">{playTime}</td>
      <td className="text-center">
        {expectedBlockOutput(owned, rented, playTime).toFixed(2)}
      </td>
    </tr>
  );
};

export default Row;
