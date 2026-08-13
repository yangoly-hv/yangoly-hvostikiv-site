"use client";

import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import { cn } from "@/shared/utils";

type CollectionDonateCtaProps = {
  monoJarUrl: string | null;
  buttonText: string;
  className?: string;
};

const primaryLinkClassName =
  "inline-flex items-center justify-center uppercase py-3 px-6 rounded-[28px] transition-all duration-300 ease-in-out text-[14px] xl:text-[18px] leading-[110%] font-bold text-white bg-green hover:brightness-125 active:scale-95";

/** Collection CTA: Mono jar link only. WayForPay checkout is tails-only for now. */
export default function CollectionDonateCta({
  monoJarUrl,
  buttonText,
  className = "",
}: CollectionDonateCtaProps) {
  if (!monoJarUrl) return null;

  return (
    <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
      <a
        href={monoJarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(primaryLinkClassName, className)}
      >
        {buttonText}
      </a>
    </AnimatedWrapper>
  );
}
