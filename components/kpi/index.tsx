import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";

const KPI = ({
  value,
  unit,
  description,
}: {
  value: string;
  unit: string;
  description: string;
}) => {
  return (
    <div className="border max-w-fit bg-darkgreen border-gray-700 p-2 m-1 text-xs">
      <div className="flex items-center justify-end">
        <p className="text-lg">{value}</p>
        &nbsp;
        <p className="">{unit}</p>
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};

export default KPI;
