import * as motion from "motion/react-client";
import clsx from "clsx";
import Image from "next/image";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
const WhatVolunteerGetDesk = ({
  title,
  subtitle,
  paragraphs,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
}) => {
  return (
    <section className="relative pb-[120px] px-4 xl:px-[40px] mx-auto hidden lg:block">
      <div className="absolute z-10 bottom-[30px] xl:bottom-[-60px] right-[-67px] w-[540px] h-[314px] xl:w-[900px] xl:h-[617px]">
        <Image
          src="/images/volounteering/animals.webp"
          alt="Dogs"
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 50vw, 33vw"
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
          className="text-[18px] font-medium leading-[130%] mt-4 max-w-[80%]"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={listItemVariants}
        className="relative rounded-[8px] overflow-hidden w-full bg-[#F4E1C1] mt-[45px] pl-[32px] pt-[68px] pb-[64px]"
      >
        <Image
          src="/images/volounteering/paw-1.png"
          alt="Paws"
          width={131}
          height={131}
          className="absolute left-0 top-0"
        />
        <Image
          src="/images/volounteering/paw-2.png"
          alt="Paws"
          width={131}
          height={131}
          className="absolute right-0 top-0"
        />
        <Image
          src="/images/volounteering/paw-3.png"
          alt="Paws"
          width={131}
          height={131}
          className="absolute left-[230px] lg:left-auto lg:right-[756px] bottom-0"
        />
        <ul className="relative z-10 flex flex-col gap-6 max-w-[645px] 2xl:max-w-[675px]">
          {paragraphs.map((paragraph, index) => (
            <li
              className={clsx(
                index === 3 && "max-w-[70%]",
                index === 4 && "max-w-[65%]"
              )}
              key={index}
            >
              <p className="text-[18px] leading-[130%] flex gap-[10px] items-center">
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
  );
};

export default WhatVolunteerGetDesk;
