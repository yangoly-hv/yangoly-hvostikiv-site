import * as motion from "motion/react-client";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import { getTranslations } from "next-intl/server";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
const Hero = async () => {
  const t = await getTranslations("Hero");
  return (
    <section className="relative z-0 md:pt-[300px] lg:pt-[48px] lg:pb-[48px] xl:py-[141px]">
      <div className="absolute inset-0 w-full h-full overflow-hidden xl:left-0 xl:w-[115%]">
        <picture className="pointer-events-none absolute inset-0 hidden sm:block">
          <source srcSet="/images/hero-bg-desk.avif" type="image/avif" />
          <img
            src="/images/hero-bg-desk.webp"
            alt=""
            className="h-full w-full object-cover lg:object-[center_40%] xl:object-[left_38%]"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <picture className="lg:hidden">
          <source srcSet="/images/hero-bg-mob.avif" type="image/avif" />
          <img
            src="/images/hero-bg-mob.webp"
            alt=""
            aria-hidden="true"
            className="h-[694px] w-full object-cover object-[center_-80px] sm:object-[center_32%]"
            decoding="async"
          />
        </picture>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15 md:bg-gradient-to-r md:from-black/20 md:via-black/30 md:to-black/55"
        />

      </div>
        <div className="relative z-30 flex flex-col flex-wrap gap-[57px] lg:flex-row lg:flex-nowrap lg:items-stretch lg:justify-center lg:px-[20px] lg:py-[20px] xl:justify-start xl:gap-[40px] xl:py-0 xl:pl-[40px] xl:pr-0">
            <div className="order-2 md:order-1 lg:shrink-0">
                <DonationForm />
            </div>
            <div className="order-1 flex min-h-[354px] flex-col pt-4 md:order-2 md:mt-[300px] md:min-h-0 max-w-[700px] lg:mt-0 lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[700px] lg:justify-center">
                    <motion.h1
                        className="text-white font-arial uppercase text-center leading-[122%] lg:text-left mt-0 text-[22px] lg:text-[56px]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={{
                            hidden: {opacity: 0},
                            visible: {opacity: 1, transition: {duration: 0.6, delay: 0.5}},
                        }}
                    >
                        {t("title")}
                    </motion.h1>
                    <motion.div
                        className="mx-auto lg:mx-0 max-w-[288px] mt-[14px] lg:max-w-full lg:w-full flex flex-col items-center lg:items-start xl:flex-row xl:justify-between lg:mt-[24px]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                    >
                        <motion.p
                            className="text-white text-center lg:text-left leading-[122%] text-[16px] lg:text-[32px] xl:max-w-[432px] "
                            variants={{
                                hidden: {opacity: 0, y: 20},
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {duration: 0.6, delay: 0.8},
                                },
                            }}
                        >
                            {t("callToAction")}
                        </motion.p>
                    </motion.div>
            </div>
        </div>
        <SafeImage
          src="/images/home/hero-paw.svg"
          alt=""
          width={91}
          height={91}
          aria-hidden="true"
          className="pointer-events-none absolute right-[15px] top-[96px] z-20 h-[47px] w-[47px] origin-center opacity-80 lg:right-[28px] rotate-[180deg] lg:top-auto lg:bottom-[188px] lg:h-[91px] lg:w-[91px]"
        />
        <SafeImage
          src="/images/home/hero-paw.svg"
          alt=""
          width={232}
          height={232}
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10px] top-[-35px] z-20 h-[120px] w-[120px] origin-center rotate-[200deg] opacity-80 lg:right-[-20px] lg:top-auto lg:bottom-[-68px] lg:h-[232px] lg:w-[232px] lg:rotate-[-20deg]"
        />
    </section>
  );
};

export default Hero;
