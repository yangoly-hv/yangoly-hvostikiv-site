import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";

import { IHelpVolonteeringTranslation } from "@/shared/types";

import VounteeringCardList from "../VolunteeringCard/VounteeringCardList";

const HelpSection = async () => {
  const t = await getTranslations("VolunteeringPage");
  const helpsList = t.raw("helpsList") as IHelpVolonteeringTranslation[];
  const formCard = t.raw("formCard") as IHelpVolonteeringTranslation;
  return (
    <div className="">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-[24px] lg:text-[32px] leading-[130%] uppercase font-arial"
      >
        {t("helpTitle")}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-4 xl:max-w-[818px] text-[18px] font-medium leading-[130%]"
      >
        {t("helpSubtitle")}
      </motion.p>
      <VounteeringCardList helpsList={helpsList} formCard={formCard} />
    </div>
  );
};

export default HelpSection;
