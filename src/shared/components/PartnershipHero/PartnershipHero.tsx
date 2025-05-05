import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import PartnershipHeroMob from "./PartnershipHeroMob";
import PartnershipHeroDesk from "./PartnershipHeroDesk";

const PartnershipHero = async () => {
  const t = await getTranslations("Partnership");

  return (
    <section className="pb-[100px] lg:pb-[145px]">
      <div className="container px-[34px]  xl:px-[40px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mt-[60px] mb-[48px] font-arial text-[24px] lg:text-[44px] leading-[130%] uppercase"
        >
          {t("title")}
        </motion.h1>
      </div>
      <PartnershipHeroMob />
      <PartnershipHeroDesk />
    </section>
  );
};

export default PartnershipHero;
