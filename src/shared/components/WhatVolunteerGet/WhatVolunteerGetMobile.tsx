import * as motion from "motion/react-client";
import Image from "next/image";
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
      <section className="mt-[40px] container px-4 xl:px-[40px] mx-auto ">
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
          className="bg-[#F4E1C1]  rounded-[8px] mt-[40px] "
        >
          <ul className="flex flex-col gap-6 pt-[32px] px-[32px] pb-[130px]">
            {paragraphs.map((paragraph, index) => (
              <li key={index}>
                <p className="text-[14px] leading-[130%] flex gap-[10px] items-center">
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
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={listItemVariants}
        className="mt-[-180px]"
      >
        <div className="relative  mx-auto max-w-[524px]  h-[294px] ">
          <Image
            src="/images/volounteering/dogs-mob.webp"
            className=" md:bottom-[20px]  absolute z-[2]"
            fill
            alt="Dogs"
          />
        </div>
        <div className="relative mt-[-140px] h-[105px] w-full ">
          <Image
            src="/images/volounteering/ellipse-mob.png"
            fill
            alt="Ellipse"
            className=" z-[1]"
          />
        </div>
      </motion.div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default WhatVolunteerGetMobile;
