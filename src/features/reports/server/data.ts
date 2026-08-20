import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/shared/config/site";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import {
  normalizeReportDetail,
  type ReportDetailRecord,
} from "../model/mapReportImages";
import type { ReportSummary } from "../model/types";
import {
  allReportSlugsQuery,
  allReportsQuery,
  reportBySlugQuery,
} from "./queries";

export const getAllReports = cache((locale: AppLocale) =>
  sanityFetch<ReportSummary[]>(
    allReportsQuery,
    { lang: locale },
    { tags: [sanityTags.reportsList] }
  )
);

export const getReportBySlug = cache(async (locale: AppLocale, slug: string) => {
  const report = await sanityFetch<ReportDetailRecord | null>(
    reportBySlugQuery,
    { lang: locale, slug },
    { tags: [sanityTags.report(slug)] }
  );
  return normalizeReportDetail(report);
});

export type ReportSlug = { slug: string; updatedAt?: string };

export const getAllReportSlugs = cache(async (locale: AppLocale) => {
  const rows = await sanityFetch<ReportSlug[]>(
    allReportSlugsQuery,
    { lang: locale },
    { tags: [sanityTags.reportsList, sanityTags.sitemap] }
  );
  return rows;
});
