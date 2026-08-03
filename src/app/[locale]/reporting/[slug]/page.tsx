import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import Report from "@/modules/Report/Report";
import {
  getAllReportSlugs,
  getReportBySlug,
} from "@/features/reports/server/data";
import { formatReportDate } from "@/features/reports/model/formatReportDate";
import { locales } from "@/shared/config/site";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllReportSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: PageParams<{ slug: string }>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slug) {
    return getPageMetadata({ locale, key: "reporting", path: "/reporting" });
  }

  const [report, t] = await Promise.all([
    getReportBySlug(locale, slug),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);
  const fallback = t.raw("reporting") as {
    title: string;
    description: string;
    keywords: string;
  };

  if (!report) {
    return getPageMetadata({
      locale,
      key: "reporting",
      path: `/reporting/${slug}`,
    });
  }

  const date =
    typeof report.date === "string"
      ? report.date
      : formatReportDate(report.date, locale);
  const title = `${fallback.title} | ${report.title} | ${date}`;

  return getPageMetadata({
    locale,
    path: `/reporting/${slug}`,
    values: {
      title,
      description: `${fallback.description} | ${report.title} | ${date}`,
      keywords: fallback.keywords,
    },
    image: report.images?.[0],
  });
}

export default async function ReportPage({ params }: PageParams<{ slug: string }>) {
  const { slug, locale } = await params;
  if (!slug) notFound();

  setRequestLocale(locale);
  const [report, t] = await Promise.all([
    getReportBySlug(locale, slug),
    getTranslations({ locale }),
  ]);

  if (!report) notFound();

  const preparedReport = {
    ...report,
    date:
      typeof report.date === "string"
        ? report.date
        : formatReportDate(report.date, locale),
  };

  return (
    <>
      <Report
        report={preparedReport}
        translation={t.raw("Reporting")}
        locale={locale}
      />
      <Contacts />
    </>
  );
}
