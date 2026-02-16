import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";
import Image from "next/image";

interface BenefitsItem {
  title: string;
  text: string;
}

const PartnershipBenefitsForYou = async () => {
  const t = await getTranslations("PartnershipBenefitsForYou");
  const title = t("title");
  const items = (await t.raw("items")) as BenefitsItem[];

  return (
    <section className="pt-[120px] pb-[138px] lg:pt-0 lg:pb-[120px]">
      <div className="relative container bg-white pt-[40px] pb-[89px] lg:pt-[90px] lg:pb-[195px] mx-auto px-[16px] lg:px-[40px]">
        <div className="absolute z-10 bottom-[26px] sm:bottom-[40px] lg:bottom-[119px] left-1/2 -translate-x-1/2 lg:left-[auto] lg:translate-x-0 md:right-[-88px] w-[540px] h-[314px] xl:w-[900px] xl:h-[676px]">
          <Image
            src="/images/partners/animals.webp"
            alt="animals"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="uppercase font-arial text-[24px] xl:text-[32px] text-black xl:font-black leading-[130%] xl:leading-[140%] mb-[34px]"
        >
          {title}
        </motion.h2>
        <div className="relative rounded-[8px] overflow-hidden w-full text-left bg-[#F4E1C1] px-[30px] pt-[32px] lg:pt-[64px] pb-[217px] lg:pb-[64px]">
          <PawIcon className="absolute top-[-17px] right-[-17px] w-[81px] h-[81px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[30deg] opacity-30" />
          <PawIcon className="absolute top-[-17px] lg:top-[-68px] left-[-17px] w-[66px] h-[66px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[-44deg] opacity-30" />
          <PawIcon className="absolute bottom-[77px] left-[-18px] lg:bottom-[265px] lg:left-auto lg:right-[538px] w-[79px] h-[79px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[150deg] opacity-30" />
          <div className="relative z-10 flex flex-col gap-6">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.05 + index * 0.08,
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col gap-1"
              >
                <span className="font-bold text-black text-[14px] lg:text-[16px] xl:text-[18px] leading-[130%]">
                  {item.title}
                </span>
                <span className="text-black max-w-[654px] text-[14px] lg:text-[16px] xl:text-[18px] leading-[130%]">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipBenefitsForYou;
