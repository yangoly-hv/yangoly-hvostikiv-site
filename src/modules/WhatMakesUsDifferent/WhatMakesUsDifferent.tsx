import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

const WhatMakesUsDifferent = async () => {
  const t = await getTranslations("WhatMakesUsDifferent");
  const title = t("title");
  const block1 = t("block1");
  const block2 = t("block2");
  const block3 = t("block3");
  const block4 = t("block4");
  const block5 = t("block5");

  const tileClass =
    "bg-white rounded-[8px] px-5 py-6 flex flex-col justify-center min-h-[100px] border border-black/10";

  return (
    <section className="pt-[20px] pb-[60px] lg:pt-[40px] lg:pb-[80px]">
      <div className="container mx-auto px-[16px] lg:px-[40px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="uppercase font-arial text-[20px] xl:text-[32px] text-black xl:font-black md:text-center leading-[100%] xl:leading-[140%] mb-6 md:mb-10"
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileClass} md:col-start-1 md:row-start-1`}
          >
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%]">
              {block1}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileClass} md:col-start-2 md:row-start-1`}
          >
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%]">
              {block2}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileClass} md:col-start-1 md:row-start-2 md:row-span-2`}
          >
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%]">
              {block3}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileClass} md:col-start-2 md:row-start-2`}
          >
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%]">
              {block4}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileClass} md:col-start-2 md:row-start-3`}
          >
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%]">
              {block5}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferent;
