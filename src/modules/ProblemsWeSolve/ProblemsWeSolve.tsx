import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";
import { ProblemsWeSolveBgSvg } from "@/shared/components/Icons/problemsWeSolve/BgSvg";

const ProblemsWeSolve = async () => {
  const t = await getTranslations("ProblemsWeSolve");
  const title = t("title");
  const block1Chunks = t("block1").split("\n\n").filter(Boolean);
  const block2Chunks = t("block2").split("\n\n").filter(Boolean);

  return (
    <section className="relative pt-[40px] pb-[107px] xl:pb-[137px]">
      <div className="absolute inset-0">
        <div className="w-full h-[165px] absolute bottom-0 left-0">
          <ProblemsWeSolveBgSvg className="w-full h-full" />
        </div>
        <PawIcon className="absolute top-[-83px] lg:top-[-26px] right-[calc(50%+92px)] md:right-auto md:left-[-34px] w-[167px] h-[167px] text-orange rotate-[-54.76deg] opacity-80" />
        <PawIcon className="absolute top-[216px] md:top-[19px] right-[-30px] md:right-[-20px] w-[84px] h-[84px] lg:w-[114px] lg:h-[114px] text-orange rotate-134 opacity-80" />
      </div>
      <div className="relative z-10 container mx-auto px-[46px] lg:px-[40px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="uppercase font-arial text-[20px] xl:text-[44px] text-black xl:font-black text-center leading-[100%] xl:leading-[140%] mb-5 md:mb-10"
        >
          {title}
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-5 lg:gap-10 xl:gap-[71px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-row items-start gap-4 md:flex-1"
          >
            <PawIcon
              className="w-[32px] h-[32px] lg:w-[60px] lg:h-[60px] shrink-0 text-green rotate-180"
            />
            <p className="text-black text-[14px] lg:text-[16px] leading-[130%] flex flex-col gap-[1lh]">
              {block1Chunks.map((chunk, i) => (
                <span key={i}>{chunk}</span>
              ))}
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
              className="w-[32px] h-[32px] lg:w-[60px] lg:h-[60px] shrink-0 text-green rotate-180"
            />
            <p className="text-black text-[14px] lg:text-[16px] leading-[130%] flex flex-col gap-[1lh]">
              {block2Chunks.map((chunk, i) => (
                <span key={i} className={i === 1 ? "font-semibold" : undefined}>
                  {chunk}
                </span>
              ))}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsWeSolve;
