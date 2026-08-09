import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
export default function ChangeLifeImagesDesk() {
  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="hidden md:block absolute -z-10 top-[-50px] left-[-40px] xl:left-[-50px] md:h-[509px] xl:h-[634px] aspect-854/634"
      >
        <SafeImage
          src="/images/home/changeLife/pawsDesk.svg"
          alt="paws"
          width="854"
          height="634"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        className="hidden md:block absolute -z-10 md:bottom-0 md:right-[-300px] lg:right-[-90px] xl:right-[-100px] desk:right-0
  aspect-577/196 md:h-[409px] xl:h-[549px] desk:h-[649px]"
      >
        <SafeImage
          src="/images/home/changeLife/greenEllipseDesk.svg"
          alt="background"
          width="1433"
          height="520"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9 })}
        className="hidden md:block absolute z-20 md:bottom-[-12px] lg:bottom-[-30px] xl:bottom-0 md:right-0 xl:right-[65px] desk:right-10 md:w-[338px]
    lg:w-[518px] xl:w-[671px] aspect-1460/1040"
      >
        <SafeImage
          src="/images/home/changeLife/dogs.png"
          alt="dogs"
          width={1460}
          height={1040}
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="hidden md:block absolute z-10 md:top-[88px] lg:top-[28px] xl:top-[28px] md:right-[-105px] xl:right-[-105px] desk:right-10 md:w-[338px]
        lg:w-[418px] xl:w-[622px] aspect-622/476"
      >
        <SafeImage
          src="/images/home/changeLife/heart.svg"
          alt="heart"
          width="622"
          height="476"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
    </>
  );
}
