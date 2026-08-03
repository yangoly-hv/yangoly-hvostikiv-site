"use client";
import Image from "next/image";
import ClockIcon from "../../../public/images/icons/ClockIcon";
import type { BlogPost } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import { motion } from "motion/react";
import { fadeIn, slideUp, generalSlideUp } from "@/shared/utils";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

export default function BlogArticle({
  article,
  translation,
}: {
  article: BlogPost;
  translation: IBlog;
}) {
  const { title, description, mainImage, secondaryImage, additionalInfo } = article;
  const { timeToRead } = translation;

  const readingTime = "1";

  return (
    <section className="text-dark mx-auto container pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <div className="lg:flex items-center justify-between gap-x-[141px] mb-[60px] lg:mb-12">
        <div className="lg:w-[49.3%] mb-[44px] lg:mb-0">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-7 text-[32px] lg:text-[40px] font-bold leading-[130%]"
          >
            {title}
          </motion.h1>
          <motion.p
            variants={generalSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="mb-7 text-[14px] lg:text-[18px] font-light leading-[130%]"
          >
            <PortableTextRenderer value={description} />
          </motion.p>
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
            className="flex items-center gap-x-3"
          >
            <ClockIcon className="size-5 lg:size-[27px]" />
            <span className="text-[20px] lg:text-[24px] font-bold leading-[130%]">
              {readingTime}
              {timeToRead}
            </span>
          </motion.div>
        </div>
        {mainImage && <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
          className="relative w-full lg:w-[40.8%] max-w-[585px] h-[383px] mx-auto lg:mx-0"
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover object-center rounded-[18.05px]"
            sizes="(max-width: 1024px) 100vw, 40.8vw"
          />
        </motion.div>}
      </div>
      {additionalInfo ? (
        <div className="mb-[60px] lg:mb-[96px] text-[14px] lg:text-[18px] font-light leading-[130%]">
          <PortableTextRenderer value={additionalInfo} />
        </div>
      ) : null}
      {secondaryImage && <motion.div
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
        className="relative w-full max-w-[585px] lg:max-w-full aspect-328/189 lg:aspect-1429/455 mx-auto lg:mx-0"
      >
        <Image
          src={secondaryImage}
          alt={title}
          fill
          className="rounded-[18.05px] object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 100vw"
        />
      </motion.div>}
    </section>
  );
}
