import { getLocale, getTranslations } from "next-intl/server";
import {
  fadeInAnimation,
  listVariants,
} from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AnimatedListItem from "@/shared/components/Animations/AnimatedListItem";
import LiquidGlass from "@/shared/components/LiquidGlass/LiquidGlass";
import { getTopDonorBoard } from "@/features/home/server/data";
import { Locale } from "@/shared/types";
import TopDonorRow from "./TopDonorRow";

export default async function TopDonors() {
  const lang = (await getLocale()) as Locale;
  const donors = await getTopDonorBoard(lang);
  if (!donors.length) return null;

  const t = await getTranslations("TopDonors");

  return (
    <section className="relative mb-[100px] overflow-hidden py-2 xl:mb-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,214,153,0.6),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(112,148,128,0.4),transparent_65%)] blur-2xl"
      />
      <div className="container relative mx-auto px-4 xl:px-10">
        <AnimatedWrapper
          as="h2"
          animation={fadeInAnimation({ y: 30 })}
          className="mb-3 text-center font-arial text-[20px] uppercase leading-[130%] xl:mb-4 xl:text-[32px]"
        >
          {t("title")}
        </AnimatedWrapper>
        <AnimatedWrapper
          as="p"
          animation={fadeInAnimation({ y: 30, delay: 0.2 })}
          className="mx-auto mb-8 max-w-[560px] text-center text-[13px] leading-[140%] text-dark/60 xl:mb-12 xl:text-[16px]"
        >
          {t("subtitle")}
        </AnimatedWrapper>
        <LiquidGlass className="mx-auto max-w-[860px] p-2.5 md:p-5 xl:p-7">
          <AnimatedWrapper
            as="ul"
            animation={listVariants({ staggerChildren: 0.08, delayChildren: 0.2 })}
            className="flex flex-col gap-2 md:gap-2.5"
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
    </section>
  );
}
