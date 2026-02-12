import * as motion from "motion/react-client";
// import DonateAction from "@/shared/components/DonateAction/DonateAction";
import DonationForm from "@/modules/Hero/Donation/DonationForm";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const Hero = async () => {
  const t = await getTranslations("Hero");
  return (
    <section className="relative md:pt-[300px] xl:py-[141px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full xl:left-0 xl:w-[115%]">
        <Image
          src="/images/hero-bg-desk.jpg"
          alt="Hero background"
          fill
          className="hidden sm:flex object-cover w-full h-full lg:object-bottom xl:object-left-bottom"
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
        <div className="relative lg:py-[20px] xl:py-0 lg:pl-[20px] xl:pl-[40px] flex justify-center xl:justify-start xl:items-center flex-wrap lg:flex-nowrap gap-[57px] xl:gap-[40px] z-10">
            <div className="order-2 md:order-1">
                <DonationForm />
            </div>
            <div className="order-1 md:order-2 max-w-[700px] lg:max-w-[50%] xl:max-w-[700px] lg:flex lg:content-between flex-wrap mt-[386px] lg:mt-[20px] xl:mt-0">
                    <motion.h1
                        className="text-white font-arial uppercase text-center leading-[122%] lg:text-left mt-[12px] text-[32px] lg:text-[52px] xl:text-[64px] lg:mt-0"
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
                        className="mx-auto xl:mx-0 max-w-[288px] mt-[14px] xl:max-w-full xl:w-full flex flex-col items-center xl:flex-row xl:justify-between lg:mt-[24px]"
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
    </section>
  );
};

export default Hero;
