import Image from "next/image";

const Banner = ({ src }: { src: StaticImageData | string }) => {
  return (
    <div className="relative min-h-banner max-h-banner min-w-full rounded-b-lg">
      <Image src={src} layout="fill" quality={100} objectFit="cover" />
    </div>
  );
};

export default Banner;
