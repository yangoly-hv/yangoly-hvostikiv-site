import { IPartnersSupport } from "@/shared/types";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import SupportListBlock from "./SupportListBlock";
import ContactFormAction from "../ContactFormAction/ContactFormAction";
import Button from "../Button/Button";

const PartnersSupport = async () => {
  const t = await getTranslations("PartnersSupport");

  const firstPart = (await t.raw("firstPart")) as IPartnersSupport;
  const secondPart = (await t.raw("secondPart")) as IPartnersSupport;

  const maxListLength = Math.max(firstPart.list.length, secondPart.list.length);
  const baseDelay = 0.15;
  const delayAfterList = baseDelay * maxListLength + 0.2;

  return (
    <section className="container px-4 xl:px-[40px] mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="lg:hidden uppercase text-center font-arial leading-[130%] text-[24px] mb-[58px] "
      >
        {t("titleMob")}
      </motion.h2>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="hidden lg:block uppercase text-center font-arial leading-[130%] font-black text-[44px] mb-[125px] "
      >
        {t("titleDesk")}
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] lg:gap-[170px]">
        <div>
          <SupportListBlock data={firstPart} />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: delayAfterList,
            }}
            className="lg:hidden mt-3"
          >
            <ContactFormAction buttonText={t("partnersButton")} />
          </motion.div>
        </div>

        <div>
          <SupportListBlock data={secondPart} />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: delayAfterList,
            }}
            className="lg:hidden mt-3"
          >
            <Button className="w-full h-[45px]" text={t("documentsButton")} />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: delayAfterList + 0.3,
        }}
        className="w-[601px] h-[61px] mt-[33px] hidden lg:block mx-auto"
      >
        <ContactFormAction
          className="text-[18px] h-[61px]"
          buttonText={t("partnersButton")}
        />
      </motion.div>
    </section>
  );
};

export default PartnersSupport;
