import Image from "next/image";

const Avatar = ({ src }: { src: StaticImageData | string }) => {
  return (
    <div className="relative w-32 h-32 overflow-hidden -mt-28 border-yellow-900 rounded-2xl border-4">
      <Image src={src} className="rounded-b-xl" layout="fill" quality={100} />
    </div>
  );
};

export default Avatar;
