import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/shared/config/site";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import type { ReportDetail, ReportSummary } from "../model/types";
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

export const getReportBySlug = cache((locale: AppLocale, slug: string) =>
  sanityFetch<ReportDetail | null>(
    reportBySlugQuery,
    { lang: locale, slug },
    { tags: [sanityTags.report(slug)] }
  )
);

export const getAllReportSlugs = cache(async () => {
  const rows = await sanityFetch<Array<{ slug: string }>>(
    allReportSlugsQuery,
    {},
    { tags: [sanityTags.reportsList, sanityTags.sitemap] }
  );
  return rows.map(({ slug }) => slug);
});
