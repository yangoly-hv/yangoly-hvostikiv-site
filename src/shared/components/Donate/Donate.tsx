"use client";
import { IDonateProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import Button from "@/shared/components/Button/Button";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import { useOneTimeDonationJarUrl } from "@/providers/OneTimeDonationJarProvider";
import { trackMonoDonateClick } from "@/shared/lib/metaPixel";

export default function Donate({
  buttonText,
  className = "",
}: IDonateProps) {
  const jarUrl = useOneTimeDonationJarUrl();
  if (!jarUrl) return null;

  return (
    <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
      <Button
        href={jarUrl}
        text={buttonText}
        className={className}
        onClick={trackMonoDonateClick}
      />
    </AnimatedWrapper>
  );
}
