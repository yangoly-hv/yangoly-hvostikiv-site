"use client";
import { IInfoBlockProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, generalSlideUp } from "@/shared/utils";
import clsx from "clsx";

const InfoBlock = ({
  translation,
  children,
  className = "",
  titleClassName = "",
  ...props
}: IInfoBlockProps) => {
  const { paragraphs, title } = translation;
  return (
    <div className={`mx-auto  bg-white ${className}`} {...props}>
      <motion.h2
        className={clsx(
          "text-[20px] xl:text-left  uppercase font-extrabold text-center font-arial xl:text-[32px] text-[#140A01] leading-[130%] mb-[28px]",
          titleClassName
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        custom={0.2}
      >
        {title}
      </motion.h2>
      <motion.div
        className="space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            className="text-black text-[14px] md:text-[16px] xl:text-[18px] font-light leading-[130%]"
            variants={generalSlideUp}
            custom={index * 0.2}
            viewport={{ once: true }}
            initial="hidden"
            whileInView="visible"
          >
            {paragraph.segments?.map((segment, segIndex) => (
              <span
                key={segIndex}
                className={segment.bold ? "font-normal" : "font-normal"}
              >
                {segment.text}
              </span>
            ))}
          </motion.p>
        ))}
      </motion.div>
      {children && <>{children}</>}
    </div>
  );
};

export default InfoBlock;
