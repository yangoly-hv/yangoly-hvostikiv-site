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
import { toPlainText, truncateDescription } from "@/shared/lib/seo";
import { getBreadcrumbSchema, getReportSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";

export const dynamicParams = true;

export async function generateStaticParams() {
  const localizedSlugs = await Promise.all(
    locales.map(async (locale) => ({ locale, slugs: await getAllReportSlugs(locale) }))
  );
  return localizedSlugs.flatMap(({ locale, slugs }) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  );
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
  const description = truncateDescription(
    toPlainText(report.shortFoodDescription) ||
      toPlainText(report.shortHouseDescription) ||
      toPlainText(report.shortTherapyDescription) ||
      fallback.description
  );

  return getPageMetadata({
    locale,
    path: `/reporting/${slug}`,
    values: {
      title,
      description,
      keywords: fallback.keywords,
    },
    image: report.images?.[0],
    imageAlt: report.title,
    modifiedTime: report.updatedAt,
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
  const datePublished =
    typeof report.date === "string"
      ? undefined
      : `${report.date.year}-${String(report.date.month).padStart(2, "0")}-01`;
  const description = truncateDescription(
    toPlainText(report.shortFoodDescription) ||
      toPlainText(report.shortHouseDescription) ||
      toPlainText(report.shortTherapyDescription) ||
      report.title
  );

  return (
    <>
      <JsonLd
        data={[
          getReportSchema({
            locale,
            path: `/reporting/${slug}`,
            title: report.title,
            description,
            image: report.images?.[0],
            datePublished,
            dateModified: report.updatedAt,
            reportFileUrl: report.reportFileUrl,
            reportFileName: report.reportFileName,
          }),
          getBreadcrumbSchema(locale, [
            { name: locale === "uk" ? "Головна" : "Home", path: "" },
            { name: locale === "uk" ? "Звітність" : "Reporting", path: "/reporting" },
            { name: report.title, path: `/reporting/${slug}` },
          ]),
        ]}
      />
      <Report
        report={preparedReport}
        translation={t.raw("Reporting")}
        locale={locale}
      />
      <Contacts />
    </>
  );
}
