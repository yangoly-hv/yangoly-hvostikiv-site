import Image from "next/image";

export default function ChangeLifeImagesMob() {
  return (
    <>
      <div className="md:hidden absolute z-10 bottom-[148px] sm:bottom-[96px] left-[calc(50%-288px)] h-[196px] w-[577px]">
        <Image
          src="/images/home/changeLife/greenEllipse.webp"
          alt="background"
          width="1154"
          height="392"
          className="w-full h-full object-cover"
        />
      </div>
      <Image
        src="/images/home/changeLife/dogs.webp"
        alt="dogs"
        width={1460}
        height={1040}
        className="md:hidden absolute z-20 bottom-[120px] sm:bottom-[68px] left-[calc(50%-169px)] w-[338px] h-auto"
      />
      <div className="md:hidden absolute top-[-12px] left-[calc(50%-197px)] h-[436px] aspect-[394/436]">
        <Image
          src="/images/home/changeLife/pawsMob.svg"
          alt="paws"
          width="394"
          height="436"
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
}
