import * as motion from "motion/react-client";
// import DonateAction from "@/shared/components/DonateAction/DonateAction";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const Hero = async () => {
  const t = await getTranslations("Hero");
  return (
    <section className="relative xl:py-[141px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-bg-desk.jpg"
          alt="Hero background"
          fill
          className="hidden sm:flex object-cover w-full h-full lg:object-top"
          quality={75}
          priority
          sizes="100vw"
        />
          <div style={{backgroundImage: "url(/images/hero-bg-mob.png)"}} className="h-[694px] bg-cover bg-center xl:hidden" />

        {/*<Image*/}
        {/*  src="/images/hero-bg-mob.png"*/}
        {/*  alt="Hero background"*/}
        {/*  fill*/}
        {/*  className="object-cover object-top sm:hidden w-full h-full"*/}
        {/*  quality={75}*/}
        {/*  priority*/}
        {/*  sizes="100vw"*/}
        {/*/>*/}
      </div>

        <div className="relative flex justify-center flex-wrap gap-[57px] z-10">
            <div className="order-2 md:order-1">
                <DonationForm />
            </div>

            <div className="order-1 md:order-2 max-w-[700px] xl:flex xl:content-between flex-wrap mt-[386px] xl:mt-0">
                <div>
                    <motion.h2
                        className="text-center xl:text-left text-white font-arial text-[16px] font-black leading-[122%] uppercase xl:text-[36px] xl:font-extrabold"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {duration: 0.6, delay: 0.2},
                            },
                        }}
                    >
                        {t("subtitle")}
                    </motion.h2>
                    <motion.h1
                        className="text-center xl:text-left text-white font-arial uppercase mt-[12px] leading-[122%] font-black text-[40px] xl:text-[100px] xl:font-extrabold"
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
                </div>
                <div>
                    <motion.div
                        className="mx-auto xl:mx-0 max-w-[288px] mt-[14px] xl:mt-0 xl:max-w-full xl:w-full flex flex-col items-center xl:flex-row xl:justify-between"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                    >
                        <motion.p
                            className="text-white text-center leading-[122%] text-[16px] xl:text-[32px] xl:max-w-[432px] xl:text-left"
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
                    <motion.div
                        className="mx-auto xl:mx-0 max-w-[288px] flex flex-col items-center xl:flex-row xl:max-w-full xl:w-full xl:justify-between"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                    >
                        <motion.p
                            className="text-white mt-[14px] text-center leading-[122%] text-[16px]  xl:text-[20px] xl:max-w-[432px] xl:text-left"
                            variants={{
                                hidden: {opacity: 0, y: 20},
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {duration: 0.6, delay: 0.8},
                                },
                            }}
                        >
                            {t("text")}
                        </motion.p>
                    </motion.div>
                </div>

            </div>

        </div>
    </section>
  );
};

export default Hero;
