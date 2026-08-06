import { PortableText } from "@portabletext/react";
import * as motion from "motion/react-client";

import HelpTabs from "@/modules/Report/HelpTabs";
import ReportSlider from "@/modules/Report/ReportSlider";
import { getSafeHref } from "@/shared/lib/safeHref";
import { fadeInAt } from "@/shared/utils";

import { portableTextComponents } from "./portableTextComponents";
import { buildReportTabsData } from "./reportTabsData";
import type { ReportForView, ReportTab } from "./types";

type ReportProps = {
  translation: { viewReportButton?: string };
  report: ReportForView;
  locale: "uk" | "en";
};

function buildTabsFromReport(report: ReportForView, locale: ReportProps["locale"]): ReportTab[] {
  return buildReportTabsData(report, locale).map((tab) => ({
    id: tab.id,
    title: tab.title,
    description: tab.description,
    iconSrc: tab.iconSrc,
    cta: tab.cta,
    field: tab.field,
    content: (
      <PortableText
        value={report[tab.field] ?? []}
        components={portableTextComponents}
      />
    ),
  }));
}

export default function Report({ translation, report, locale }: ReportProps) {
  const { date, title, reportFileUrl } = report;
  const safeReportFileUrl = getSafeHref(reportFileUrl);
  const images = report.images ?? [];
  const hasImages = images.length > 0;

  const tabs = buildTabsFromReport(report, locale);
  const hasTabs = tabs.length > 0;
  const viewReportButtonText =
    translation?.viewReportButton ?? "Переглянути цей звіт";

  return (
    <section className="pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px]">
      {/* ================= TEXT BLOCK (container) ================= */}
      <div className="mx-auto container px-4 xl:px-10">
        <div className="lg:flex items-center justify-between gap-x-[141px] mb-[32px] lg:mb-[44px]">
          <div className="lg:w-[70.3%]">
            <motion.h2
              variants={fadeInAt()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-arial font-normal mb-[12px] text-[18px] lg:text-[24px] leading-[130%]"
            >
              {date}
            </motion.h2>

            <motion.h1
              variants={fadeInAt(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-arial uppercase text-[24px] lg:text-[32px] font-normal leading-[130%]"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </div>

      {hasImages && (
        <div className="mb-[32px] lg:mb-[44px]">
          <ReportSlider images={images} />
        </div>
      )}

      {/* ================= BOTTOM TEXT (container) ================= */}
      <div className="mx-auto container px-4 xl:px-10">
        <div className="text-[14px] lg:text-[18px] font-light leading-[130%]">
          {hasTabs && (
            <HelpTabs
              tabs={tabs}
              reportFileUrl={safeReportFileUrl}
              viewReportButtonText={viewReportButtonText}
            />
          )}
        </div>
        {!hasTabs && safeReportFileUrl && (
          <motion.a
            variants={fadeInAt(0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            href={safeReportFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 lg:mt-8 flex w-full items-center justify-center rounded-[28px] bg-green px-6 py-3 text-center text-[14px] font-bold uppercase leading-[110%] text-white transition-all duration-300 ease-in-out hover:brightness-125 active:scale-95 xl:mx-auto xl:w-fit xl:text-[18px]"
          >
            {viewReportButtonText}
          </motion.a>
        )}
      </div>
    </section>
  );
}
