import Image from "next/image";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AngelsList from "./AngelsList";
import Donate from "../../shared/components/Donate/Donate";
import { getTranslations } from "next-intl/server";

export default async function AngelsMob({ title }: { title?: string }) {
  const t = await getTranslations("Angels");

  return (
    <div className="md:hidden flex flex-col gap-y-10">
      <div className="relative z-10 bg-white pt-[33px] pb-[87px] overflow-hidden">
        <AnimatedWrapper
          animation={fadeInAnimation({ scale: 0.9, delay: 0.4 })}
          className="absolute bottom-0 left-[calc(50%-180px)] w-[211px] aspect-[905/934]"
        >
          <Image
            src="/images/home/angels/dog.webp"
            alt="dog"
            width={905}
            height={934}
            className="w-full h-full object-contain"
          />
        </AnimatedWrapper>
        <div className="absolute -z-10 top-[-127px] left-[calc(50%-308px)] w-[1166px] h-[1103px]">
          <Image
            src="/images/home/angels/ellipseMob.svg"
            alt="background"
            width="1166"
            height="1103"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container px-4 xl:px-10 mx-auto">
          <AnimatedWrapper
            as="h2"
            animation={fadeInAnimation({ y: 30 })}
            className="max-w-[152px] ml-[calc(50%+31px)] font-arial text-[14px] xl:text-[24px] leading-[157%] xl:leading-[142px] uppercase"
          >
            {title ? title : t("title")}
          </AnimatedWrapper>
        </div>
      </div>
      <div className="flex flex-col gap-y-10 container px-4 xl:px-10 mx-auto">
        <AngelsList />
        <Donate
          buttonText={t("makeContribution")}
          className="w-full md:w-[297px] lg:w-[397px] xl:w-[607px] xl:h-[67px]"
        />
      </div>
    </div>
  );
}
