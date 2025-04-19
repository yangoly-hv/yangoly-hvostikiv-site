import Image from "next/image";
import { IAngelsDeskProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AngelsList from "./AngelsList";
import Donate from "../../shared/components/Donate/Donate";

export default function AngelsDesk({
  translation,
  lang,
  donateModalTranslataion,
}: IAngelsDeskProps) {
  const { title, makeContribution } = translation;

  return (
    <div className="hidden md:block container px-4 xl:px-10 mx-auto">
      <div className="relative z-10 flex xl:gap-x-[38px] laptop:gap-x-[38px] desk:gap-x-[180px] px-[30px] pt-[56px] pb-6 bg-white rounded-[8px] overflow-hidden">
        <AnimatedWrapper
          animation={fadeInAnimation({ scale: 0.9, delay: 0.4 })}
          className="absolute -z-10 md:top-[144px] lg:top-[54px] md:left-0 lg:left-[-8px] xl:top-0 xl:left-0 md:w-[292px] 
        lg:w-[372px] xl:w-[453px] aspect-[905/934]"
        >
          <Image
            src="/images/home/angels/dog.webp"
            alt="dog"
            width={905}
            height={934}
            className="w-full h-full object-cover"
          />
        </AnimatedWrapper>
        <Image
          src="/images/home/angels/ellipseDesk.svg"
          alt="background"
          width="1097"
          height="536"
          className="absolute -z-20 md:top-[-35px] lg:top-0 left-[-40px] xl:left-0 h-[536px] w-auto"
        />
        <div className="relative md:w-[49.9%] ">
          <AnimatedWrapper
            as="h2"
            animation={fadeInAnimation({ y: 30 })}
            className="max-w-[201px] xl:max-w-[258px] laptop:max-w-[301px] ml-auto mb-[269px] xl:mb-[217px] font-arial text-[14px] xl:text-[24px] leading-[157%] xl:leading-[142%] uppercase"
          >
            {title}
          </AnimatedWrapper>
          <AnimatedWrapper
            animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
            className="absolute -z-20 md:top-[-46px] xl:top-[-56px] md:right-0 xl:right-[-60px] laptop:right-[-21px] w-[259px] 
          xl:w-[359px] aspect-[359/250]"
          >
            <Image
              src="/images/home/angels/textEllipse.svg"
              alt="background"
              width="359"
              height="250"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
          <Donate
            buttonText={makeContribution}
            lang={lang}
            donateModalTranslataion={donateModalTranslataion}
            className="w-full md:w-[297px] lg:w-[397px] xl:w-[607px] xl:h-[67px]"
          />
        </div>
        <AngelsList lang={lang} translation={translation} />
      </div>
    </div>
  );
}
