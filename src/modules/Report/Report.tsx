"use client";
// import { IReportProps } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";

import {getReportData} from "@/shared/utils/functions";
import Button from "@/shared/components/Button/Button";

//@ts-expect-error
export default function Report({ translation, report }) {
    const transformData = getReportData(report);
  const { date, title, description, mainPart, mainPhoto, secondaryPhoto, link } =
      transformData;

  return (
    <section className="mx-auto container pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <div className="lg:flex items-center justify-between gap-x-[141px] mb-[60px] lg:mb-12">
          <div className="lg:w-[49.3%] mb-[44px] lg:mb-0">
              <motion.h2
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0}
                  className="mb-7 text-[24px] lg:text-[32px] font-bold leading-[130%]"
              >
                  {date}
              </motion.h2>
              <motion.h1
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0.2}
                  className="mb-7 text-[32px] lg:text-[40px] font-black leading-[130%]"
              >
                  {title}
              </motion.h1>
              <div

                  className="mb-7 text-[14px] lg:text-[18px] font-light leading-[130%]"
                  dangerouslySetInnerHTML={{__html: description}}
              >
                  {/*{description}*/}
              </div>
              <motion.p
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0.6}
                  className="relative w-full "
              >
                  <Link href={link} target="_blank">
                      <Button

                          className="py-3 text-[14px] font-semibold xl:text-[18px]"
                          text={translation.detailsButton}
                      />
                  </Link>
              </motion.p>
          </div>
          {mainPhoto && <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
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
      <div className="mb-[60px] lg:mb-[96px] text-[14px] lg:text-[18px] font-light leading-[130%]" dangerouslySetInnerHTML={{ __html: mainPart }}>
        {/*{mainPart.map((item, idx) => (*/}
        {/*  <motion.p*/}
        {/*    key={idx}*/}
        {/*    variants={generalSlideUp}*/}
        {/*    initial="hidden"*/}
        {/*    whileInView="visible"*/}
        {/*    viewport={{ once: true }}*/}
        {/*    custom={0.8 + idx * 0.2}*/}
        {/*  >*/}
        {/*    {item}*/}
        {/*  </motion.p>*/}
        {/*))}*/}
      </div>
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
