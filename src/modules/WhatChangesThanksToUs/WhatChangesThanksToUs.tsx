import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { PawIcon } from "@/shared/components/Icons/PawIcon";
import Image from "next/image";

const WhatChangesThanksToUs = async () => {
  const t = await getTranslations("WhatChangesThanksToUs");
  const title = t("title");
  const items = (await t.raw("items")) as string[];

  return (
    <section className="pt-[120px] pb-[138px] lg:pt-[92px] lg:pb-[217px]">
      <div className="relative container mx-auto px-[16px] lg:px-[40px]">
        <div className="absolute z-10 bottom-[-18px] md:bottom-[-107px] left-1/2 -translate-x-1/2 lg:left-[auto] lg:translate-x-0 lg:right-[-22px] w-[530px] h-[216px] md:w-[700px] md:h-[340px] lg:w-[900px] lg:h-[458px]">
          <Image src="/images/home/whatChanges/animals.webp"
            alt="animals"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="uppercase font-arial text-[24px] xl:text-[32px] text-black xl:font-black md:text-center leading-[130%] xl:leading-[140%] mb-[34px]"
          >
            {title}
          </motion.h2>
          <div className="relative rounded-[8px] overflow-hidden w-full text-left bg-[#F4E1C1] px-[33px] pt-[32px] lg:pt-[64px] pb-[233px] lg:pb-[64px]">
            <PawIcon className="absolute top-[-17px] right-[-17px] w-[81px] h-[81px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[30deg] opacity-30" />
            <PawIcon className="absolute top-[-17px] lg:top-[-68px] left-[-17px] w-[66px] h-[66px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[-44deg] opacity-30" />
            <PawIcon className="absolute bottom-[77px] left-[-18px] lg:bottom-[-42px] lg:left-[35%] w-[79px] h-[79px] lg:w-[131px] lg:h-[131px] text-[#BB9B53] rotate-[150deg] opacity-30" />
            <div className="relative z-10 flex flex-col gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 0.05 + index * 0.08,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex items-center gap-[10px]"
                >
                  <span className="font-ranga text-[24px] leading-[130%] text-green shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-black text-[14px] lg:text-[16px] xl:text-[18px] leading-[130%]">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhatChangesThanksToUs;
