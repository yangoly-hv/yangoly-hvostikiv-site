import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
const tileBaseClass =
  "overflow-hidden relative w-full rounded-[8px] pl-[28px] xl:pl-[44px]";

const WhatMakesUsDifferent = async () => {
  const t = await getTranslations("WhatMakesUsDifferent");
  const title = t("title");

  return (
    <section className="relative bg-white rounded-[8px] pt-[40px] pb-[32px] lg:pt-[92px] lg:pb-[90px]">
      <PawIcon className="absolute top-[17px] lg:top-[83px] left-[calc(50%+13px)] lg:left-[calc(50%-193px)] w-[143px] h-[143px] lg:w-[133px] lg:h-[133px] text-orange rotate-[120.38deg] lg:rotate-[-137deg] opacity-30" />
      <div className="container mx-auto px-[16px] lg:px-[40px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="uppercase font-arial text-[20px] xl:text-[32px] text-black xl:font-black leading-[100%] xl:leading-[140%] mb-8 md:mb-10 whitespace-pre-line lg:whitespace-normal"
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[328px_225px_118px] lg:grid-rows-[262px_290px_214px] gap-8 md:gap-x-5 md:gap-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileBaseClass} pr-[71px] bg-orange-bright h-[328px] lg:h-[262px] md:col-start-1 md:row-start-1`}
          >
            <div className="relative z-10 flex items-center gap-[32px] xl:gap-[52px]">
              <span className="font-ranga text-[128px] xl:text-[228px] leading-[120%] shrink-0 text-[#CB9B54]">
                1
              </span>
              <p className="text-black max-w-[213px] text-[14px] lg:text-[16px] xl:text-[24px] leading-[130%] tracking-[-0.22px]">
                {t("block1")}
              </p>
            </div>
            <div className="absolute bottom-[-10px] left-[-11px] lg:bottom-0 lg:left-auto lg:right-[-15px] w-[322px] h-auto aspect-322/262">
              <SafeImage src="/images/home/makesDifferent/card-1.webp"
                alt="What Makes Us Different"
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileBaseClass} pr-[42px] bg-[#D6E6D5] h-[328px] lg:h-[262px] md:col-start-2 md:row-start-1`}
          >
            <div className="relative z-10 flex items-center gap-[32px] xl:gap-[52px]">
              <span className="font-ranga text-[128px] xl:text-[228px] leading-[120%] shrink-0 text-[#A4C1A2]">
                2
              </span>
              <p className="text-black max-w-[292px] text-[14px] lg:text-[16px] xl:text-[24px] leading-[130%] tracking-[-0.22px]">
                {t("block2")}
              </p>
            </div>
            <div className="absolute bottom-[-18px] left-[-73px] lg:bottom-[-20px] lg:left-auto lg:right-[-115px] w-[457px] h-auto aspect-457/255">
              <SafeImage src="/images/home/makesDifferent/card-2.webp"
                alt="What Makes Us Different"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileBaseClass} pr-[32px] xl:pt-[60px] bg-[#DFD8EC] h-[343px] lg:h-[504px] md:col-start-1 md:row-start-2 md:row-span-2`}
          >
            <div className="relative z-10 flex items-center xl:items-start xl:flex-col-reverse gap-[32px] xl:gap-[52px]">
              <span className="font-ranga text-[128px] xl:text-[228px] leading-[120%] shrink-0 text-[#9B88C0]">
                3
              </span>
              <p className="text-black  text-[14px] lg:text-[16px] xl:text-[24px] leading-[130%] tracking-[-0.22px]">
                {t("block3")}
              </p>
            </div>
            <div className="absolute bottom-[-7px] left-[-52px] lg:bottom-[-2px] lg:left-auto lg:right-[-83px] w-[397px] xl:w-[661px] h-auto aspect-567/317 -scale-x-100">
              <SafeImage src="/images/home/makesDifferent/card-3.webp"
                alt="What Makes Us Different"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileBaseClass} pr-[37px] bg-[#F4E1C1] h-[343px] md:h-[225px] lg:h-[290px] md:col-start-2 md:row-start-2`}
          >
            <div className="relative z-10 flex items-center gap-[32px] xl:gap-[52px]">
              <span className="font-ranga text-[128px] xl:text-[228px] leading-[120%] shrink-0 text-[#D2B88E]">
                4
              </span>
              <p className="text-black max-w-[302px] text-[14px] lg:text-[16px] xl:text-[24px] leading-[130%] tracking-[-0.22px]">
                {t("block4")}
              </p>
            </div>
            <div className="absolute bottom-[-107px] left-[-12px] xl:bottom-[16px] xl:left-auto xl:right-[-28px] w-[363px] xl:w-[281px] h-auto aspect-303/252">
              <SafeImage src="/images/home/makesDifferent/card-4.webp"
                alt="What Makes Us Different"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`${tileBaseClass} flex flex-row items-center pr-[83px] bg-[#DDF8BC] h-[118px] lg:h-[193px] md:col-start-2 md:row-start-3`}
          >
            <div className="relative z-10 flex items-center gap-[32px] xl:gap-[52px]">
              <span className="font-ranga text-[128px] xl:text-[228px] leading-[120%] shrink-0 text-[#B3CE92]">
                5
              </span>
              <p className="text-black max-w-[292px] text-[14px] lg:text-[16px] xl:text-[24px] leading-[130%] tracking-[-0.22px]">
                {t("block5")}
              </p>
            </div>
            <PawIcon className="absolute bottom-[-23px] right-[-11px] md:bottom-[-67px] md:right-[-32px] w-[106px] h-[106px] xl:w-[258px] xl:h-[258px] text-[#A8C487] rotate-[139.44deg] opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferent;
