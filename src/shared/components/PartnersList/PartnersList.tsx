import * as motion from "motion/react-client";
import { IPartnerItem } from "@/shared/types";
import { getTranslations } from "next-intl/server";
import PartnersListItem from "./PartnersListItem";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import Image from "next/image";

const PartnersList = async () => {
  const t = await getTranslations("PartnersList");
  const list = (await t.raw("list")) as IPartnerItem[];

  return (
    <section className="relative pb-[100px] lg:pb-[120px] ">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="px-4 container mx-auto xl:px-[40px] uppercase text-center font-arial leading-[130%] text-[24px] lg:text-[44px] mb-[39px] xl:mb-[64px]"
      >
        {t("title")}
      </motion.h2>
      <div className="container  px-4 xl:px-[40px] mx-auto overflow-hidden">
        <motion.div
          className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 relative z-[2]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {list.map((partner, index) => (
            <motion.div
              key={index}
              variants={listItemVariants}
            >
              <PartnersListItem partner={partner} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersList;
