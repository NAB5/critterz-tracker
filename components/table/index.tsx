import Image from "next/image";
import RowPlayer from "./rowPlayer";
import RowRentee from "./rowRentee";

const Row = ({
  className = "",
  profile,
  address,
  blockInfo,
  critterzInfo,
}: {
  className?: string;
  profile: any;
  blockInfo: any;
  critterzInfo: any;
  address: string;
}) => {
  return (
    <div
      className={
        "flex items-center border border-x-0 border-b-0 bg-darkgreen w-full border-gray-700 text-xs p-2 bordeer-collapse" +
        className
      }
    >
      <table className="table-auto border-collapse m-3 w-full">
        <thead>
          <tr>
            <th className="border border-gray-700 p-1">player.</th>
            <th className="border border-gray-700 p-1">$BLOCK earned.</th>
            <th className="border border-gray-700 p-1">
              14d average playtime.
            </th>
            <th className="border border-gray-700 p-1">
              est. daily $BLOCK output.
            </th>
          </tr>
        </thead>
        <tbody>
          <RowPlayer
            blockEarned={blockInfo}
            timePerEpoch={profile.timePerEpoch}
            totalOwnedCritterz={critterzInfo.totalOwned}
            totalRentedCritterz={critterzInfo.totalRented}
          />
          {Object.keys(blockInfo.toClaim.rentalRewards).map((rentee, index) => {
            return (
              <RowRentee
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
