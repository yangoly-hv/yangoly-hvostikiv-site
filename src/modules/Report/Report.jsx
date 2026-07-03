"use client";

import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";

import HelpTabs from "@/modules/Report/HelpTabs";
import ReportSlider from "@/modules/Report/ReportSlider";
import { fadeIn } from "@/shared/utils";

import { portableTextComponents } from "./portableTextComponents";
import { buildReportTabsData } from "./reportTabsData.mjs";

function buildTabsFromReport(report) {
  return buildReportTabsData(report).map((tab) => ({
    id: tab.id,
    title: tab.title,
    description: tab.description,
    iconSrc: tab.iconSrc,
    cta: tab.cta,
    content: (
      <PortableText
        value={report[tab.field]}
        components={portableTextComponents}
      />
    ),
  }));
}

export default function Report({ translation, report }) {
  const { date, title } = report;
  const images = report.images ?? [];
  const hasImages = images.length > 0;

  const tabs = buildTabsFromReport(report);
  const hasTabs = tabs.length > 0;

  return (
    <section className="pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px]">
      {/* ================= TEXT BLOCK (container) ================= */}
      <div className="mx-auto container px-4 xl:px-10">
        <div className="lg:flex items-center justify-between gap-x-[141px] mb-[32px] lg:mb-[44px]">
          <div className="lg:w-[70.3%]">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="font-arial font-normal mb-[12px] text-[18px] lg:text-[24px] leading-[130%]"
            >
              {date}
            </motion.h2>

            <motion.h1
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
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
          {hasTabs && <HelpTabs tabs={tabs} />}
        </div>
      </div>
    </section>
  );
}
