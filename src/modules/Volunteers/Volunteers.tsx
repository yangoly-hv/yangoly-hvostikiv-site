import { getLocale, getTranslations } from "next-intl/server";
import {
  fadeInAnimation,
  listVariants,
} from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AnimatedListItem from "@/shared/components/Animations/AnimatedListItem";
import { getVolunteers } from "@/features/home/server/data";
import { Locale } from "@/shared/types";
import VolunteerCard from "./VolunteerCard";

export default async function Volunteers() {
  const lang = (await getLocale()) as Locale;
  const volunteers = await getVolunteers(lang);
  if (!volunteers.length) return null;

  const t = await getTranslations("Volunteers");

  return (
    <section className="relative mb-[100px] overflow-hidden py-2 xl:mb-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,214,153,0.55),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(112,148,128,0.35),transparent_65%)] blur-2xl"
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
        <AnimatedWrapper
          as="ul"
          animation={listVariants({ staggerChildren: 0.12, delayChildren: 0.2 })}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6"
        >
          {volunteers.map((volunteer) => (
            <AnimatedListItem key={volunteer._id} className="h-full">
              <VolunteerCard
                volunteer={volunteer}
                contributionLabel={t("contributionLabel")}
              />
            </AnimatedListItem>
          ))}
        </AnimatedWrapper>
      </div>
    </section>
  );
}
