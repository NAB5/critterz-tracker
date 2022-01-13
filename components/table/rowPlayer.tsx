import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";

function getTotalBlock(block: any) {
  let totalBlock = 0;
  if (block.wallet) {
    totalBlock += parseFloat(
      block.wallet.balance.slice(0, -18) + "." + block.wallet.balance.slice(-18)
    );
  }

  if (block.toClaim) {
    totalBlock += block.toClaim.playReward;

    // for (const renter in block.toClaim.rentalRewards) {
    //   totalBlock += block.toClaim.rentalRewards[renter];
    // }
  }

  return totalBlock;
}

function getAverage(timePerEpoch: number[], days: number) {
  let avg = 0;
  for (let i = 0; i < days; i++) {
    avg += timePerEpoch[i];
  }

  return avg / days;
}

function _expectedBlockOutput(nCritterz: number, playTime: number): number {
  return 24 * nCritterz + Math.sqrt((playTime / 60) * nCritterz) * 100;
}

function expectedBlockOutput(
  owned: number,
  rented: number,
  playTime: number
): number {
  return (
    _expectedBlockOutput(owned, playTime) +
    (2 / 3) * _expectedBlockOutput(rented, playTime)
  );
}

const Row = ({
  className = "",
  blockEarned,
  timePerEpoch,
  totalOwnedCritterz,
  totalRentedCritterz,
}: {
  className?: string;
  blockEarned: any;
  timePerEpoch: number[];
  totalOwnedCritterz: number;
  totalRentedCritterz: number;
}) => {
  return (
    <tr className={`font-bold ${className}`}>
      <td className="pl-4 text-left">You</td>
      <td className="text-center">{getTotalBlock(blockEarned).toFixed(2)}</td>
      <td className="text-center">{getAverage(timePerEpoch, 14).toFixed(2)}</td>
      <td className="text-center">
        {expectedBlockOutput(
          totalOwnedCritterz,
          totalRentedCritterz,
          getAverage(timePerEpoch, 14)
        ).toFixed(2)}
      </td>
    </tr>
  );
};

export default Row;
