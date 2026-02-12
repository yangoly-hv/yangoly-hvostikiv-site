import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";

const ActivityDirections = async () => {
  const t = await getTranslations("ActivityDirections");
  const title = t("title");
  const items = (await t.raw("items")) as string[];

  return (
    <section className="pt-[20px] pb-[120px] lg:pt-[71px] lg:pb-[74px]">
      <div className="container mx-auto px-[16px] lg:px-[40px]">
        <div className="relative bg-white rounded-[8px] px-[30px] xl:px-[68px] pt-[40px] pb-[54px] md:pt-20 lg:py-[32px]">
          <div className="absolute inset-0">
            <PawIcon className="absolute top-[17px] right-[12px] w-[143px] h-[143px] rotate-[120.38deg] text-orange opacity-30
            md:top-[8px] md:right-auto md:left-[18px] md:rotate-[-30deg]
            " />
            <PawIcon className="absolute bottom-[13px] left-[8px] w-[86px] h-[86px] rotate-[-155.7deg] text-orange opacity-30
            md:bottom-auto md:top-[12px] md:left-auto md:right-[78px] md:rotate-[30deg]
            " />
          </div>
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="uppercase font-arial text-[20px] xl:text-[32px] text-black xl:font-black md:text-center leading-[100%] xl:leading-[140%] mb-6 md:mb-[34px] whitespace-pre-line lg:whitespace-normal"
            >
              {title}
            </motion.h2>
            <div className="flex flex-col md:flex-row gap-3.5">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.1 + index * 0.1,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={[
                    "flex items-center justify-center px-[27px] md:px-6 bg-transparent border border-black rounded-[28px]",
                    "h-[93px] md:h-[113px]",
                    "md:flex-1",
                    index === 0 && "md:max-w-[363px] xl:w-[363px] md:flex-none",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="text-black font-semibold text-[14px] lg:text-[16px] xl:text-[18px] leading-[130%] uppercase">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityDirections;
