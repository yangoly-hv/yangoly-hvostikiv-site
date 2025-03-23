"use client";
import BlogList from "./BlogList";
import { IBlogProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn } from "@/shared/utils";

export default function Blog({ translation, lang }: IBlogProps) {
  const { title } = translation;

  return (
    <section className="mx-auto container pt-[60px] xl:pt-8 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <motion.h1
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="mb-8 xl:mb-12 font-arial text-dark font-black text-center text-[24px] xl:text-[32px] leading-[31.2px] xl:leading-[41.6px] uppercase"
      >
        {title}
      </motion.h1>
      <BlogList lang={lang} translation={translation} />
    </section>
  );
}
