import * as motion from "motion/react-client";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import { getTranslations } from "next-intl/server";
import { IHelpAnimalsListItem } from "@/shared/types";
import HelpAnimalsList from "./HelpAnimalsList";

const HelpAnimalsSection = async () => {
  const t = await getTranslations("CharityEvents.helpAnimal");
  const list = (await t.raw("list")) as IHelpAnimalsListItem[];
  return (
    <section className="container px-4 xl:px-[40px] pb-[107px] lg:pb-[120px] mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-[24px] uppercase leading-[130%] font-arial text-center lg:text-[32px] lg:text-left"
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
      <HelpAnimalsList list={list} />
    </section>
  );
};

export default HelpAnimalsSection;
