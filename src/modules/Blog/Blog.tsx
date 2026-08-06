import BlogList from "./BlogList";
import type { BlogPostSummary } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import * as motion from "motion/react-client";
import { fadeInAt } from "@/shared/utils";

export default function Blog({
  data,
  translation,
  page,
}: {
  data: BlogPostSummary[];
  translation: IBlog;
  page?: string;
}) {
  const { title } = translation;

  return (
    <section className="mx-auto container pt-[60px] xl:pt-8 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <motion.h1
        variants={fadeInAt()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-8 xl:mb-12 font-arial text-dark font-black text-center text-[24px] xl:text-[32px] leading-[31.2px] xl:leading-[41.6px] uppercase"
      >
        {title}
      </motion.h1>
      <BlogList data={data} translation={translation} page={page} />
    </section>
  );
}
