import * as motion from "motion/react-client";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import HeroSlideshow, { type HeroSlide } from "@/modules/Hero/HeroSlideshow";
import { getTranslations } from "next-intl/server";

import SafeImage from "@/shared/components/SafeImage/SafeImage";

const SLIDES_BASE = "/images/home/hero-slides";

const slides: HeroSlide[] = [
  { name: "slide-1", position: "object-[center_42%]" },
  { name: "slide-2", position: "object-[center_55%]" },
  { name: "slide-3", position: "object-[center_45%]" },
  { name: "slide-4", position: "object-[center_45%]" },
  { name: "slide-5", position: "object-[center_60%]" },
].map(({ name, position }) => ({
  deskAvif: `${SLIDES_BASE}/${name}-desk.avif`,
  deskWebp: `${SLIDES_BASE}/${name}-desk.webp`,
  mobAvif: `${SLIDES_BASE}/${name}-mob.avif`,
  mobWebp: `${SLIDES_BASE}/${name}-mob.webp`,
  position,
}));

const Hero = async () => {
  const t = await getTranslations("Hero");
  return (
    <section className="relative z-0 mt-[-72px] overflow-hidden bg-dark lg:mt-[-80px] 2xl:mt-[-88px]">
      <HeroSlideshow
        slides={slides}
        railLabel={t("galleryLabel")}
        slideLabelPrefix={t("slideLabel")}
      />

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between gap-[40px] px-[16px] pb-[88px] pt-[110px] md:px-[32px] lg:flex-row lg:items-center lg:gap-[48px] lg:px-[40px] lg:pb-[96px] lg:pt-[128px] xl:gap-[64px] xl:px-[80px]">
        <div className="flex max-w-[720px] flex-col items-center pt-[16px] text-center lg:flex-1 lg:items-start lg:pt-0 lg:text-left">
          <motion.h1
            className="mt-0 font-arial text-[20px] uppercase leading-[130%] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-[28px] lg:text-[34px] xl:text-[40px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.2, ease: "easeOut" },
              },
            }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="mt-[16px] max-w-[420px] text-[16px] leading-[140%] text-white/90 md:text-[20px] lg:mt-[24px] lg:max-w-[520px] lg:text-[26px] xl:text-[30px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.45, ease: "easeOut" },
              },
            }}
          >
            {t("callToAction")}
          </motion.p>
        </div>

        <motion.div
          className="w-full max-w-[524px] self-center lg:w-auto lg:shrink-0 lg:self-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.9, delay: 0.35, ease: "easeOut" },
            },
          }}
        >
          <DonationForm />
        </motion.div>
      </div>

      <SafeImage
        src="/images/home/hero-paw.svg"
        alt=""
        width={91}
        height={91}
        aria-hidden="true"
        className="pointer-events-none absolute right-[15px] top-[86px] z-20 h-[44px] w-[44px] rotate-[180deg] opacity-70 lg:hidden"
      />
      <SafeImage
        src="/images/home/hero-paw.svg"
        alt=""
        width={232}
        height={232}
        aria-hidden="true"
        className="pointer-events-none absolute right-[-14px] top-[-38px] z-20 h-[110px] w-[110px] rotate-[200deg] opacity-70 lg:hidden"
      />
    </section>
  );
};

export default Hero;
