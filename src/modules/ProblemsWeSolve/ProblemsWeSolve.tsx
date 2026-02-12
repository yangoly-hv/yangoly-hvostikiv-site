import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";

const ProblemsWeSolve = async () => {
  const t = await getTranslations("ProblemsWeSolve");
  const title = t("title");
  const block1 = t("block1");
  const block2 = t("block2");

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
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-row items-start gap-4 md:flex-1"
          >
            <PawIcon
              className="w-[60px] h-[60px] shrink-0 text-green-soft"
            />
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%] whitespace-pre-line">
              {block1}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-row items-start gap-4 md:flex-1"
          >
            <PawIcon
              className="w-[60px] h-[60px] shrink-0 text-green-soft"
            />
            <p className="text-black text-[14px] lg:text-[16px] leading-[140%] whitespace-pre-line">
              {block2}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsWeSolve;
