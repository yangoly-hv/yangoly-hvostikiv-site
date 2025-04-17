import Image from "next/image";
import { IAngelsDeskProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import AngelsList from "./AngelsList";

export default function AngelsDesk({ translation, lang }: IAngelsDeskProps) {
  const { title, makeContribution } = translation;

  return (
    <div className="hidden md:block container px-4 xl:px-10 mx-auto">
      <div className="relative z-10 flex xl:gap-x-[38px] laptop:gap-x-[38px] desk:gap-x-[180px] px-[30px] pt-[56px] pb-6 bg-white rounded-[8px] overflow-hidden">
        <Image
          src="/images/home/angels/dog.webp"
          alt="dog"
          width={905}
          height={934}
          className="absolute -z-10 md:top-[144px] lg:top-[54px] md:left-0 lg:left-[-8px] xl:top-0 xl:left-0 md:w-[292px] lg:w-[372px] xl:w-[453px] h-auto"
        />
        <Image
          src="/images/home/angels/ellipseDesk.svg"
          alt="background"
          width="1097"
          height="536"
          className="absolute -z-20 md:top-[-35px] lg:top-0 left-[-40px] xl:left-0 h-[536px] w-auto"
        />
        <div className="relative md:w-[49.9%] ">
          <h2 className="max-w-[201px] xl:max-w-[258px] laptop:max-w-[301px] ml-auto mb-[269px] xl:mb-[217px] font-arial text-[14px] xl:text-[24px] leading-[157%] xl:leading-[142%] uppercase">
            {title}
          </h2>
          <Image
            src="/images/home/angels/textEllipse.svg"
            alt="background"
            width="359"
            height="250"
            className="absolute -z-20 md:top-[-46px] xl:top-[-56px] md:right-0 xl:right-[-60px] laptop:right-[-21px] w-[259px] xl:w-[359px] h-auto"
          />
          <Button
            text={makeContribution}
            className="md:w-[297px] lg:w-[397px] xl:w-[607px] xl:h-[67px]"
          ></Button>
        </div>
        <AngelsList lang={lang} translation={translation} />
      </div>
    </div>
  );
}
