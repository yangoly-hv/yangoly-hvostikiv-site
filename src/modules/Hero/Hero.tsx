import * as motion from "motion/react-client";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import { getTranslations } from "next-intl/server";

import SafeImage from "@/shared/components/SafeImage/SafeImage";

/** Flip between "dogs" and "kittens" to compare hero candidates, then lock one. */
const HERO_IMAGE: "dogs" | "kittens" = "kittens";

const heroImages = {
  dogs: {
    desk: "/images/hero-bg-dogs-desk.webp",
    mob: "/images/hero-bg-dogs-mob.webp",
    deskPosition: "object-[72%_top]",
    mobPosition: "object-[70%_top]",
  },
  kittens: {
    desk: "/images/hero-bg-kittens-desk.webp",
    mob: "/images/hero-bg-kittens-mob.webp",
    deskPosition: "object-[58%_top]",
    mobPosition: "object-[60%_top]",
  },
} as const;

const Hero = async () => {
  const t = await getTranslations("Hero");
  const images = heroImages[HERO_IMAGE];

  return (
    <section className="relative pt-[88px] md:pt-[100px] xl:pt-[110px] pb-10 xl:pb-14 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SafeImage
          src={images.desk}
          alt=""
          fill
          className={`hidden sm:block object-cover w-full h-full ${images.deskPosition}`}
          quality={75}
          priority
          sizes="100vw"
        />
        <SafeImage
          src={images.mob}
          alt=""
          fill
          className={`sm:hidden object-cover w-full h-full ${images.mobPosition}`}
          quality={75}
          priority
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/65 via-black/40 to-black/55 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-full lg:w-[55%] bg-linear-to-l from-black/45 via-black/20 to-transparent pointer-events-none"
        />
      </div>

      <div className="relative px-4 lg:pl-[20px] xl:pl-[40px] flex flex-col lg:flex-row lg:flex-nowrap justify-center xl:justify-start xl:items-start gap-5 lg:gap-8 xl:gap-[40px] z-10">
        <div className="order-1 w-full max-w-[560px] lg:max-w-[48%] xl:max-w-[560px] lg:order-2 rounded-lg px-2 py-1 lg:px-3 lg:py-2">
          <motion.h1
            className="text-white font-arial uppercase text-center leading-[122%] lg:text-left text-[26px] md:text-[34px] lg:text-[40px] xl:text-[46px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="mx-auto lg:mx-0 mt-2 md:mt-3 max-w-[320px] lg:max-w-[420px] text-white text-center lg:text-left leading-[130%] text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {t("callToAction")}
          </motion.p>
        </div>
        <div className="order-2 w-full max-w-[524px] lg:order-1">
          <DonationForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
