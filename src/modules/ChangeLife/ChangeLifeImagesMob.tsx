import Image from "next/image";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

export default function ChangeLifeImagesMob() {
  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute z-10 bottom-[208px] sm:bottom-[96px] left-[calc(50%-288px)] h-[196px] w-[577px]"
      >
        <Image
          src="/images/home/changeLife/greenEllipse.webp"
          alt="background"
          width="1154"
          height="392"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute z-20 bottom-[210px] sm:bottom-[68px] left-[calc(50%-180px)] w-[338px] aspect-[1460/1040]"
      >
        <Image
          src="/images/home/changeLife/dogs-mobile.png"
          alt="dogs"
          width={378}
          height={196}
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute top-[-12px] left-[calc(50%-197px)] h-[436px] aspect-[394/436]"
      >
        <Image
          src="/images/home/changeLife/pawsMob.svg"
          alt="paws"
          width="394"
          height="436"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
    </>
  );
}
