import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import BenefitItem from "./BenefitItem";
import Image from "next/image";

const Benefits = async () => {
  const t = await getTranslations("ChairtyEvents.benefits");
  const list = (await t.raw("list")) as string[];
  const firstList = list.slice(0, 3);
  const secondList = list.slice(3);

  return (
    <div className="bg-[#140A01] lg:py-[48px] pt-[25px] pb-[43px]">
      <div className="container  mx-auto px-4   lg:px-[40px] xl:px-[187px] ">
        <div className="lg:hidden relative aspect-[328/286] max-w-[540px] mx-auto w-full h-auto rounded-[8px] overflow-hidden">
          <Image src="/images/events/benefits-mob.webp" alt="Pet" fill />
        </div>
        <div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="text-[24px] lg:text-[32px] text-center font-arial lg:leading-[45%] lg:normal-case font-black uppercase text-white mt-[40px] lg:mt-0"
          >
            {t("title")}
          </motion.h2>

          {/* Список переваг */}
          <div className="lg:flex lg:mt-[86px] lg:gap-[70px] xl:gap-[140px]">
            <ul className="mt-6 flex flex-col gap-4">
              {firstList.map((text, i) => (
                <BenefitItem key={i} text={text} index={i} />
              ))}
            </ul>

            <ul className="mt-6 flex flex-col gap-4">
              {secondList.map((text, i) => (
                <BenefitItem key={i + 3} text={text} index={i + 3} />
              ))}
            </ul>
          </div>

          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut", delay: 1.8 },
              },
            }}
            className="text-[14px] lg:text-[20px] max-w-[701px] text-center  leading-[130%]  font-bold  text-white mt-[40px] lg:mt-[70px] mx-auto"
          >
            {t("subtitle")}
          </motion.h3>
        </div>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
          },
        }}
        className="relative aspect-[1512/465] max-h-[465px] w-full mt-[70px] hidden lg:block"
      >
        <Image
          src="/images/events/benefits-desk1.webp"
          alt="Pet"
          fill
          quality={100}
        />
      </motion.div>
    </div>
  );
};

export default Benefits;
