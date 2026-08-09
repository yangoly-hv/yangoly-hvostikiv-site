import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
const ellipseMaskStyle = {
  maskImage: "url(/images/home/changeLife/greenEllipse.webp)",
  WebkitMaskImage: "url(/images/home/changeLife/greenEllipse.webp)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as React.CSSProperties;

export default function ChangeLifeImagesMob() {
  return (
    <>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute z-10 bottom-[208px] sm:bottom-[96px] left-[calc(50%-288px)] h-[196px] w-[577px]"
      >
        <SafeImage
          src="/images/home/changeLife/greenEllipse.webp"
          alt="background"
          width="1154"
          height="392"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      {/* Dogs clipped to ellipse: same size/position as ellipse, mask by ellipse image */}
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute z-20 bottom-[208px] sm:bottom-[96px] left-[calc(50%-288px)] h-[196px] w-[577px]"
      >
        <div className="relative h-full w-full" style={ellipseMaskStyle}>
          <div className="absolute bottom-[-15px] sm:bottom-[-15px] left-[36px] w-[378px] aspect-378/237">
            <SafeImage
              src="/images/home/changeLife/dogs-mobile.webp"
              alt="dogs"
              fill
              className="object-cover"
              sizes="338px"
            />
          </div>
        </div>
      </AnimatedWrapper>
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute top-[-12px] left-[calc(50%-197px)] h-[436px] aspect-394/436"
      >
        <SafeImage
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
