import * as motion from "motion/react-client";
import Image from "next/image";
import { PawIcon } from "@/shared/components/Icons/PawIcon";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";

const WhatVolunteerGetMobile = ({
  title,
  subtitle,
  paragraphs,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
}) => {
  return (
    <div className="relative lg:hidden">
      <section className="relative container pb-[89px] mx-auto px-4 xl:px-[40px]">
        <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-[540px] h-[267px]">
          <Image
            src="/images/volounteering/animals.webp"
            alt="Dogs"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 540px"
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2
            variants={listItemVariants}
            className="text-[24px] lg:text-[32px] font-arial leading-[130%] uppercase"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={listItemVariants}
            className="text-[18px] font-medium leading-[130%] mt-4"
          >
            {subtitle}
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={listItemVariants}
          className="relative rounded-[8px] overflow-hidden w-full bg-[#F4E1C1] mt-[40px] px-[32px] pt-[32px] pb-[187px]"
        >
          <PawIcon className="absolute top-[-17px] right-[-17px] w-[81px] h-[81px] text-[#BB9B53] rotate-30 opacity-30" />
          <PawIcon className="absolute top-[-17px] left-[-17px] w-[66px] h-[66px] text-[#BB9B53] rotate-[-44deg] opacity-30" />
          <PawIcon className="absolute bottom-[77px] left-[-18px] w-[79px] h-[79px] text-[#BB9B53] rotate-150 opacity-30" />
          <ul className="relative z-10 flex flex-col gap-6">
            {paragraphs.map((paragraph, index) => (
              <li key={index}>
                <p className="text-[14px] leading-[130%] flex gap-[10px] items-center">
                  <span className="text-green text-[24px] font-bold font-ranga">
                    {index + 1}.
                  </span>
                  {paragraph}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>
      <div className="h-[100px]" />
    </div>
  );
};

export default WhatVolunteerGetMobile;
