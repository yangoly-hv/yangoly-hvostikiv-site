import { getTranslations } from "next-intl/server";
import { listVariants } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AnimatedListItem from "@/shared/components/Animations/AnimatedListItem";
import LiquidGlass from "@/shared/components/LiquidGlass/LiquidGlass";
import type { TopDonor } from "@/features/home/model/types";
import TopDonorRow from "./TopDonorRow";

export default async function AngelsBoard({
  donors,
  className,
}: {
  donors: TopDonor[];
  className?: string;
}) {
  const t = await getTranslations("Angels");

  return (
    <div className={className}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(255,214,153,0.6),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-8 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(112,148,128,0.4),transparent_65%)] blur-2xl"
      />
      <LiquidGlass className="relative p-2 md:p-2.5 xl:p-3" radiusClassName="rounded-[20px]">
        <AnimatedWrapper
          as="ul"
          animation={listVariants({ staggerChildren: 0.08, delayChildren: 0.2 })}
          className="flex flex-col gap-1.5 md:gap-2"
        >
          {donors.map((donor, idx) => (
            <AnimatedListItem key={donor._id}>
              <TopDonorRow
                donor={donor}
                rank={idx + 1}
                companyLabel={t("company")}
                hrn={t("hrn")}
              />
            </AnimatedListItem>
          ))}
        </AnimatedWrapper>
      </LiquidGlass>
    </div>
  );
}
