import * as motion from "motion/react-client";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import { getTranslations } from "next-intl/server";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
const Hero = async () => {
  const t = await getTranslations("Hero");
  return (
    <section className="relative z-0 md:pt-[300px] lg:pt-[48px] lg:pb-[48px] xl:py-[141px]">
      <div className="absolute inset-0 w-full h-full overflow-hidden xl:left-0 xl:w-[115%]">
        <SafeImage
          src="/images/hero-bg-desk.webp"
          alt=""
          fill
          className="hidden sm:flex object-cover w-full h-full lg:object-bottom xl:object-left-bottom"
          quality={75}
          priority
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          style={{ backgroundImage: "url(/images/hero-bg-mob.png)" }}
          className="h-[694px] bg-cover bg-center sm:bg-[position:center_32%] lg:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15 md:bg-gradient-to-r md:from-black/20 md:via-black/30 md:to-black/55"
        />

      </div>
        <div className="relative lg:py-[20px] xl:py-0 lg:px-[20px] xl:pl-[40px] xl:pr-0 flex justify-center xl:justify-start lg:items-stretch flex-wrap lg:flex-nowrap gap-[57px] xl:gap-[40px] z-10">
            <div className="order-2 md:order-1 lg:shrink-0">
                <DonationForm />
            </div>
            <div className="order-1 md:order-2 max-w-[700px] lg:max-w-none lg:flex-1 lg:min-w-0 xl:max-w-[700px] lg:flex lg:flex-col lg:justify-center mt-[300px] lg:mt-0">
                    <motion.h1
                        className="text-white font-arial uppercase text-center leading-[122%] lg:text-left mt-[12px] text-[32px] lg:text-[56px] lg:mt-0"
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
          className="pointer-events-none absolute right-[28px] bottom-[188px] z-20 hidden h-[91px] w-[91px] origin-center opacity-80 lg:block"
        />
        <SafeImage
          src="/images/home/hero-paw.svg"
          alt=""
          width={232}
          height={232}
          aria-hidden="true"
          className="pointer-events-none absolute right-[-20px] bottom-[-68px] z-20 hidden h-[232px] w-[232px] origin-center rotate-[-20deg] opacity-80 lg:block"
        />
    </section>
  );
};

export default Hero;
