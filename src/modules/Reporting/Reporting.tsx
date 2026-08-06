import ReportingList from "./ReportingList";
import type { ReportingListItem } from "./ReportingList";
import type { AppLocale } from "@/shared/config/site";
import type { IReporting } from "@/shared/types";
import * as motion from "motion/react-client";
import { fadeInAt } from "@/shared/utils";

export default function Reporting({
  data,
  translation,
  page,
}: {
  data: ReportingListItem[];
  translation: IReporting;
  lang: AppLocale;
  page?: string;
}) {
  return (
    <section className="mx-auto container pt-[60px] xl:pt-14 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <motion.h1
        variants={fadeInAt()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-8 xl:mb-12 font-arial font-black text-center text-[24px] xl:text-[32px] leading-[31.2px] xl:leading-[41.6px] uppercase"
      >
        {translation.title}
      </motion.h1>
      <ReportingList data={data} page={page} />
    </section>
  );
}
