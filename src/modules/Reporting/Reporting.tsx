"use client";
// import { IReportingProps } from "@/shared/types";
import ReportingList from "./ReportingList";
import { motion } from "framer-motion";
import { fadeIn } from "@/shared/utils";

//@ts-expect-error
export default function Reporting({ data, translation, lang }) {
  const { title } = translation;
    console.log(data)

  return (
    <section className="mx-auto container pt-[60px] xl:pt-14 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <motion.h1
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="mb-8 xl:mb-12 font-arial font-black text-center text-[24px] xl:text-[32px] leading-[31.2px] xl:leading-[41.6px] uppercase"
      >
        {title}
      </motion.h1>
      {/*  @ts-expect-error*/}
      <ReportingList data={data} lang={lang} />
    </section>
  );
}
