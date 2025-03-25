"use client";
import Image from "next/image";
// import { Fragment } from "react";
import ClockIcon from "../../../public/images/icons/ClockIcon";
// import { calculateReadingTime } from "@/shared/utils/calculateReadingTime";
import { IBlogArticleProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, slideUp, generalSlideUp } from "@/shared/utils";

import {getBlogItemData} from "@/shared/utils/functions";

export default function BlogArticle({article, translation}: IBlogArticleProps) {
  //@ts-expect-error
  const transformData = getBlogItemData(article);

  const { title, description, mainPhoto, secondaryPhoto, mainPart } = transformData;
  const { timeToRead } = translation;

  // const readingTime = calculateReadingTime(article);
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
            {description}
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
        {mainPhoto && <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
          className="relative w-full lg:w-[40.8%] max-w-[585px] h-[383px] mx-auto lg:mx-0"
        >
          <Image
            src={mainPhoto}
            alt={title}
            fill
            className="object-cover object-center rounded-[18.05px]"
            sizes="(max-width: 1024px) 100vw, 40.8vw"
          />
        </motion.div>}
      </div>
      {mainPart && <div className="mb-[60px] lg:mb-[96px] text-[14px] lg:text-[18px] font-light leading-[130%]" dangerouslySetInnerHTML={{ __html: mainPart }} />}
      {/*  {mainPart.lists.map((list, idx) => (*/}
      {/*    <Fragment key={idx}>*/}
      {/*      <motion.h2*/}
      {/*        variants={fadeIn}*/}
      {/*        initial="hidden"*/}
      {/*        whileInView="visible"*/}
      {/*        viewport={{ once: true }}*/}
      {/*        custom={0.6 + idx * 0.4}*/}
      {/*      >*/}
      {/*        {list.title}*/}
      {/*      </motion.h2>*/}
      {/*      <ul>*/}
      {/*        {list.items.map((item, itemIdx) => (*/}
      {/*          <motion.li*/}
      {/*            variants={generalSlideUp}*/}
      {/*            initial="hidden"*/}
      {/*            whileInView="visible"*/}
      {/*            viewport={{ once: true }}*/}
      {/*            custom={0.8 + idx * 0.4 + itemIdx * 0.2}*/}
      {/*            key={itemIdx}*/}
      {/*          >*/}
      {/*            {item}*/}
      {/*          </motion.li>*/}
      {/*        ))}*/}
      {/*      </ul>*/}
      {/*    </Fragment>*/}
      {/*  ))}*/}
      {/*  <motion.p*/}
      {/*    variants={generalSlideUp}*/}
      {/*    initial="hidden"*/}
      {/*    whileInView="visible"*/}
      {/*    viewport={{ once: true }}*/}
      {/*    custom={0.8 + mainPart.lists.length * 0.4}*/}
      {/*  >*/}
      {/*    {mainPart.text}*/}
      {/*  </motion.p>*/}
      {/*</div>*/}
      {secondaryPhoto && <motion.div
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
        className="relative w-full max-w-[585px] lg:max-w-full aspect-[328/189] lg:aspect-[1429/455] mx-auto lg:mx-0"
      >
        <Image
          src={secondaryPhoto}
          alt={title}
          fill
          className="rounded-[18.05px] object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 100vw"
        />
      </motion.div>}
    </section>
  );
}
