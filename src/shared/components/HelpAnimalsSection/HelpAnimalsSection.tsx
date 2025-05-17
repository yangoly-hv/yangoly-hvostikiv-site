import * as motion from "motion/react-client";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import { getTranslations } from "next-intl/server";
import { IHelpAnimalsListItem } from "@/shared/types";
import HelpAnimalsListMobile from "./HelpAnimalsListMobile";
import HelpAnimalsListDesktop from "./HelpAnimalsListDesktop";

const HelpAnimalsSection = async () => {
  const t = await getTranslations("ChairtyEvents.helpAnimal");
  const list = (await t.raw("list")) as IHelpAnimalsListItem[];
  return (
    <section className="container px-4 xl:px-[40px] mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-[24px] leading-[130%] font-arial text-center lg:text-[32px] lg:text-left"
          variants={listItemVariants}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-[18px] leading-[130%] hidden lg:block mt-[16px]"
          variants={listItemVariants}
        >
          {t("text")}
        </motion.p>
      </motion.div>
      <HelpAnimalsListMobile list={list} />
      <HelpAnimalsListDesktop list={list} />
    </section>
  );
};

export default HelpAnimalsSection;
