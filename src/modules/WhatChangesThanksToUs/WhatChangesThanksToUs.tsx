import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import DecoratedBenefitsPanel from "@/shared/components/DecoratedBenefitsPanel/DecoratedBenefitsPanel";

const WhatChangesThanksToUs = async () => {
  const t = await getTranslations("WhatChangesThanksToUs");
  const title = t("title");
  const items = (await t.raw("items")) as string[];

  return (
    <DecoratedBenefitsPanel
      title={title}
      sectionClassName="pt-[120px] pb-[138px] lg:pt-[92px] lg:pb-[217px]"
      containerClassName="relative container mx-auto px-[16px] lg:px-[40px]"
      animalClassName="absolute z-10 bottom-[-18px] left-1/2 h-[216px] w-[530px] -translate-x-1/2 md:bottom-[-107px] md:h-[340px] md:w-[700px] lg:right-[-22px] lg:left-auto lg:h-[458px] lg:w-[900px] lg:translate-x-0"
      animalSrc="/images/home/whatChanges/animals.webp"
      titleClassName="mb-[34px] font-arial text-[24px] uppercase leading-[130%] text-black md:text-center xl:text-[32px] xl:font-black xl:leading-[140%]"
      panelClassName="relative w-full overflow-hidden rounded-[8px] bg-[#F4E1C1] px-[33px] pt-[32px] pb-[233px] text-left lg:pt-[64px] lg:pb-[64px]"
      thirdPawClassName="absolute bottom-[77px] left-[-18px] h-[79px] w-[79px] rotate-150 text-[#BB9B53] opacity-30 lg:bottom-[-42px] lg:left-[35%] lg:h-[131px] lg:w-[131px]"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 + index * 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-center gap-[10px]"
        >
          <span className="shrink-0 font-ranga text-[24px] leading-[130%] text-green">
            {index + 1}.
          </span>
          <span className="text-[14px] leading-[130%] text-black lg:text-[16px] xl:text-[18px]">
            {item}
          </span>
        </motion.div>
      ))}
    </DecoratedBenefitsPanel>
  );
};

export default WhatChangesThanksToUs;
