import Image from "next/image";
import Link from "next/link";
import { GoPrimitiveDot } from "react-icons/go";

const Status = ({
  logoutTimestamp,
  timePerEpoch,
}: {
  logoutTimestamp: any;
  timePerEpoch: number[];
}) => {
  let status = "offline";
  status = logoutTimestamp === null ? "online" : "offline";

  return (
    <div className="max-w-fit p-2 m-1 text-xs flex items-baseline">
      <GoPrimitiveDot
        className={
          status === "offline"
            ? "text-zinc-200 flex items-center"
            : "text-green-500"
        }
      />
      &nbsp;
      <p className="text-xs text-gray-600">
        {status} | {timePerEpoch[0]} min played today.
      </p>
    </div>
  );
};

export default Status;
