import Image from "next/image";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

export default function ChangeLifeImagesDesk() {
  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="hidden md:block absolute -z-10 top-[-50px] left-[-40px] xl:left-[-50px] md:h-[509px] xl:h-[634px] aspect-[854/634]"
      >
        <Image
          src="/images/home/changeLife/pawsDesk.svg"
          alt="paws"
          width="854"
          height="634"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        className="hidden md:block absolute -z-10 md:bottom-0 md:right-[-300px] lg:right-[-90px] xl:right-[-60px] desk:right-0 
  aspect-[577/196] md:h-[409px] xl:h-[529px] desk:h-[649px]"
      >
        <Image
          src="/images/home/changeLife/greenEllipseDesk.svg"
          alt="background"
          width="1433"
          height="520"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9 })}
        className="hidden md:block absolute z-20 md:bottom-[-12px] lg:bottom-[-30px] xl:bottom-[-38px] md:right-0 xl:right-[-30px] desk:right-10 md:w-[338px] 
    lg:w-[518px] xl:w-[763px] aspect-[1460/1040]"
      >
        <Image
          src="/images/home/changeLife/dogs.webp"
          alt="dogs"
          width={1460}
          height={1040}
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
    </>
  );
}
