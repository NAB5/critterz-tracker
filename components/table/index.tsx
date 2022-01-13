import Image from "next/image";
import RowPlayer from "./rowPlayer";
import RowRentee from "./rowRentee";

const Row = ({
  className = "",
  profile,
  address,
  blockInfo,
  critterzRented,
  critterzInfo,
}: {
  className?: string;
  profile: any;
  blockInfo: any;
  critterzInfo: any;
  critterzRented: number[];
  address: string;
}) => {
  return (
    <div
      className={
        "flex items-center border border-x-0 border-b-0 bg-darkgreen w-full border-gray-700 text-xs p-1" +
        className
      }
    >
      <table className="table-auto w-full relative border-separate">
        <thead>
          <tr>
            <th className="border bg-darkgreen border-gray-700 p-1 sticky top-0 px-6">
              player.
            </th>
            <th className="border bg-darkgreen border-gray-700 p-1 sticky top-0">
              $BLOCK earned.
            </th>
            <th className="border bg-darkgreen border-gray-700 p-1 sticky top-0">
              14d average playtime.
            </th>
            <th className="border bg-darkgreen border-gray-700 p-1 sticky top-0">
              est. daily $BLOCK output.
            </th>
          </tr>
        </thead>
        <tbody>
          <RowPlayer
            className="hover:bg-white/5 "
            blockEarned={blockInfo}
            timePerEpoch={profile.timePerEpoch}
            totalOwnedCritterz={critterzInfo.totalOwned}
            totalRentedCritterz={critterzInfo.totalRented}
          />
          {Object.keys(blockInfo.toClaim.rentalRewards).map((rentee, index) => {
            return (
              <RowRentee
                className="hover:bg-white/5 "
                critterzRented={critterzRented}
                address={rentee}
                ownerAddress={address}
                key={index}
                blockEarned={blockInfo.toClaim.rentalRewards[rentee]}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Row;
