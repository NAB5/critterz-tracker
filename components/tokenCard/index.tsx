import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Timestamp from "react-timestamp";
import { useEffect, useState } from "react";
import { FaUnlock } from "react-icons/fa";

const TokenCard = ({
  title,
  description,
  contract,
  tokenId,
  subtitle,
  className,
}: {
  title: string;
  tokenId: string;
  description: string;
  contract: string;
  subtitle?: string;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData]: [any, any] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const fetchMetadata = await axios.get(`/api/${contract}/${tokenId}`);

        setData(fetchMetadata.data);
        setLoading(false);
      } catch (e) {
        setError(true);
        console.log(e);
      }
    })();
  }, []);

  let _description: any = description;
  if (loading) _description = "loading...";
  if (error) _description = "failed to fetch...";

  if (
    data.length !== 0 &&
    data.metadata[data.metadata.length - 1].trait_type === "Lock Expiration"
  ) {
    _description = (
      <div className="flex items-center">
        <FaUnlock />
        &nbsp;
        <Timestamp
          relative
          date={data.metadata[data.metadata.length - 1].value}
          autoUpdate
        />
      </div>
    );
  }

  return (
    <Link href={`https://opensea.io/assets/${contract}/${tokenId}`}>
      <a
        target="_blank"
        className={`border min-w-fit bg-darkgreen border-gray-700 p-2 m-1 text-xs hover:border-blue-600 hover:cursor-pointer active:border-blue-800 ${className} ${
          loading ? "animate-pulse" : ""
        } ${error ? "border-red" : ""}`}
      >
        <div className="flex items-center justify-end">
          <p className="text-lg">{title}</p>
          &nbsp;
          {/* <p className="">{unit}</p> */}
        </div>
        <p className="text-xs text-gray-600">{_description}</p>
      </a>
    </Link>
  );
};

export default TokenCard;
