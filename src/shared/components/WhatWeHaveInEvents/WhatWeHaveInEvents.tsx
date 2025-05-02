import { IWhatWeHaveItem } from "@/shared/types";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import WhatWeHaveList from "./WhatWeHaveList";

const WhatWeHaveInEvents = async () => {
  const t = await getTranslations("ChairtyEvents.whatWeHave");
  const list = (await t.raw("list")) as IWhatWeHaveItem[];

  return (
    <section className="container px-4 xl:px-[160px] mx-auto py-[100px] lg:py-[120px]">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
          },
        }}
        className="text-dark text-[24px] lg:text-[32px] leading-[130%] uppercase font-arial text-center mb-[32px] lg:mb-[64px]"
      >
        {t("title")}
      </motion.h2>
      <WhatWeHaveList list={list} />
    </section>
  );
};

export default WhatWeHaveInEvents;
