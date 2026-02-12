import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

const WhatChangesThanksToUs = async () => {
  const t = await getTranslations("WhatChangesThanksToUs");
  const title = t("title");
  const items = (await t.raw("items")) as string[];

  return (
    <section className="pt-[20px] pb-[120px] lg:pt-[71px] lg:pb-[74px]">
      <div className="container mx-auto px-[16px] lg:px-[40px]">
        <div className="relative bg-white rounded-[8px] px-[30px] xl:px-[68px] pt-[40px] pb-[54px] md:pt-20 lg:py-[32px]">
          <div className="relative z-10 w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="uppercase font-arial text-[20px] xl:text-[32px] text-black xl:font-black md:text-center leading-[100%] xl:leading-[140%] mb-6 md:mb-[34px] whitespace-pre-line lg:whitespace-normal"
            >
              {title}
            </motion.h2>
            <div className="w-full text-left">
              <ol className="list-decimal list-inside flex flex-col gap-3 text-black text-[14px] lg:text-[16px] xl:text-[18px] leading-[140%]">
                {items.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.05 + index * 0.08,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatChangesThanksToUs;
