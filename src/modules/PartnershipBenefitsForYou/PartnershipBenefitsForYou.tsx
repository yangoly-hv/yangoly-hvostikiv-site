import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import DecoratedBenefitsPanel from "@/shared/components/DecoratedBenefitsPanel/DecoratedBenefitsPanel";

interface BenefitsItem {
  title: string;
  text: string;
}

const PartnershipBenefitsForYou = async () => {
  const t = await getTranslations("PartnershipBenefitsForYou");
  const title = t("title");
  const items = (await t.raw("items")) as BenefitsItem[];

  return (
    <DecoratedBenefitsPanel
      title={title}
      sectionClassName="pt-[120px] pb-[138px] lg:pt-0 lg:pb-[120px]"
      containerClassName="relative container mx-auto bg-white px-[16px] pt-[40px] pb-[89px] lg:px-[40px] lg:pt-[90px] lg:pb-[195px]"
      animalClassName="absolute z-10 bottom-[26px] left-1/2 h-[314px] w-[540px] -translate-x-1/2 sm:bottom-[40px] md:right-[-88px] lg:bottom-[119px] lg:left-auto lg:translate-x-0 xl:h-[676px] xl:w-[900px]"
      animalSrc="/images/partners/animals.webp"
      titleClassName="mb-[34px] font-arial text-[24px] uppercase leading-[130%] text-black xl:text-[32px] xl:font-black xl:leading-[140%]"
      panelClassName="relative w-full overflow-hidden rounded-[8px] bg-[#F4E1C1] px-[30px] pt-[32px] pb-[217px] text-left lg:pt-[64px] lg:pb-[64px]"
      thirdPawClassName="absolute bottom-[77px] left-[-18px] h-[79px] w-[79px] rotate-150 text-[#BB9B53] opacity-30 lg:bottom-[265px] lg:left-auto lg:right-[538px] lg:h-[131px] lg:w-[131px]"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 + index * 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-1"
        >
          <span className="text-[14px] font-bold leading-[130%] text-black lg:text-[16px] xl:text-[18px]">
            {item.title}
          </span>
          <span className="max-w-[654px] text-[14px] leading-[130%] text-black lg:text-[16px] xl:text-[18px]">
            {item.text}
          </span>
        </motion.div>
      ))}
    </DecoratedBenefitsPanel>
  );
};

export default PartnershipBenefitsForYou;
