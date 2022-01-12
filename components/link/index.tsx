import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";

const LinkWrapper = ({
  className = "",
  text,
  link,
  Icon,
}: {
  className?: string;
  text: string;
  link: string;
  Icon: IconType;
}) => {
  return (
    <Link href={link}>
      <a
        className={
          "flex items-center border bg-darkgreen max-w-fit border-gray-700 p-2 m-1 text-xs " +
          className
        }
      >
        <Icon /> &nbsp;
        <p className="hover:underline">{text}</p>
      </a>
    </Link>
  );
};

export default LinkWrapper;
