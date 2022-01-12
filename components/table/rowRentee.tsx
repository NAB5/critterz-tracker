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
  ownerAddress,
  blockEarned,
}: {
  className?: string;
  address: string;
  ownerAddress: string;
  blockEarned: any;
}) => {
  const [playTime, setPlayTime] = useState(0);
  const [estBlock, setEstBlock] = useState(0);
  const [username, setUsername] = useState(
    address.slice(0, 5) + "..." + address.slice(-5)
  );
  const [owned, setOwned] = useState(0);
  const [rented, setRented] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`/api/profile/${address}`);
      const profile = response.data;
      if (profile.containsMCInfo) {
        setUsername(profile.name);
      }
      setPlayTime(getAverage(profile.timePerEpoch, 14).toFixed(2));

      const ownedTokenFetch = await axios.get(`/api/critterz/${address}/owned`);
      const ownedTokens = ownedTokenFetch.data.tokens;
      setOwned(ownedTokens.length);

      const rentedTokenFetch = await axios.get(
        `/api/critterz/${ownerAddress}/rented`
      );

      const rentedTokens = rentedTokenFetch.data.tokens;
      let intersect = ownedTokens.filter((x: any) => rentedTokens.includes(x));

      setRented(intersect.length);
    })();
  }, []);

  return (
    <tr className="">
      <td className="">
        <Link href={`/${address}`}>
          <div className="flex items-center justify-center">
            <p className="hover:underline cursor-pointer ">
              {username}({rented}/{owned})
            </p>
            &nbsp;
            <FaExternalLinkAlt />
          </div>
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
