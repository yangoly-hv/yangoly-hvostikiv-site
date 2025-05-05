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
    <section className="mt-[40px] container px-4 xl:px-[40px] mx-auto hidden lg:block pb-[100px]">
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
        className="bg-[#F4E1C1] rounded-[8px] mt-[45px] pl-[32px] pt-[68px] pb-[50px] relative"
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
          className="absolute left-[230px] xl:left-[400px] bottom-0"
        />
        <Image
          src="/images/volounteering/ellipse-desk.png"
          alt="Paws"
          width={900}
          height={175}
          className="absolute right-[-40px] w-[700px] xl:w-[900px]  xl:right-[-100px] xl:bottom-[-40px] bottom-[-50px]"
        />
        <Image
          src="/images/volounteering/dogs-desk.webp"
          alt="Paws"
          width={1213}
          height={681}
          className="absolute right-[20px] aspect-[1213/681] w-[700px] xl:h-[581px] xl:w-[1000px] xl:bottom-[-110px] xl:right-[-50px]  bottom-[-100px]"
        />
        <ul className="flex flex-col gap-6  max-w-[52%]">
          {paragraphs.map((paragraph, index) => (
            <li
              className={clsx(
                index === 3 && "max-w-[70%]",
                index === 4 && "max-w-[65%]"
              )}
              key={index}
            >
              <p className="text-[18px] leading-[130%] flex gap-[10px] items-center">
                <span className="text-[#4C7B67] text-[24px] font-bold font-ranga">
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
