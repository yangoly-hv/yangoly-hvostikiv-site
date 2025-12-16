"use client";
// import { IReportProps } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";

// import {getReportData} from "@/shared/utils/functions";
import Button from "@/shared/components/Button/Button";
import PortableTextRender from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

//@ts-expect-error
export default function Report({ translation, report }) {
    // const transformData = getReportData(report);
  const { date, title,  } = report;

  return (
    <section className="mx-auto container pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <div className="lg:flex items-center justify-between gap-x-[141px] mb-[60px] lg:mb-12">
          <div className="lg:w-[70.3%] mb-[44px] lg:mb-0">
              <motion.h2
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0}
                  className="font-arial mb-[15px] text-[24px] lg:text-[32px] font-normal leading-[130%]"
              >
                  {date}
              </motion.h2>
              <motion.h1
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0.2}
                  className="font-arial mb-7 text-[32px] lg:text-[40px] font-normal leading-[130%]"
              >
                  {title}
              </motion.h1>
              <div

                  className="mb-7 text-[14px] lg:text-[18px] font-light leading-[130%]"
                  // dangerouslySetInnerHTML={{__html: description}}
              >
                  {/*<PortableTextRender value={description} />*/}
              </div>
              <motion.p
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0.6}
                  className="relative w-full "
              >
                  {/*<Link href={link} target="_blank">*/}
                  {/*    <Button*/}

                  {/*        className="py-3 text-[14px] font-semibold xl:text-[18px]"*/}
                  {/*        text={translation.detailsButton}*/}
                  {/*    />*/}
                  {/*</Link>*/}
              </motion.p>
          </div>
      </div>
      <div className="mb-[60px] lg:mb-[96px] text-[14px] lg:text-[18px] font-light leading-[130%]"
           // dangerouslySetInnerHTML={{ __html: mainPart }}
      >
          {/*<PortableTextRender value={additionalInfo} />*/}
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
    </section>
  );
}
