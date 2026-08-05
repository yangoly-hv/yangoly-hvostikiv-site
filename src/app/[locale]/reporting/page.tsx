import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import Reporting from "@/modules/Reporting/Reporting";
import { getAllReports } from "@/features/reports/server/data";
import { formatReportDate } from "@/features/reports/model/formatReportDate";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";
import { getPageNumber } from "@/shared/lib/pagination";
import { getItemListSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({
    locale,
    key: "reporting",
    path: "/reporting",
  });
}

export default async function ReportingPage({ params, searchParams }: PageParams) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const [reports, t] = await Promise.all([
    getAllReports(locale),
    getTranslations({ locale }),
  ]);
  const preparedReports = reports.map((report) => ({
    ...report,
    date:
      typeof report.date === "string"
        ? report.date
        : formatReportDate(report.date, locale),
  }));
  const currentPage = getPageNumber(query?.page, Math.ceil(preparedReports.length / 12));
  const visibleReports = preparedReports.slice((currentPage - 1) * 12, currentPage * 12);
  const translation = t.raw("Reporting");

  return (
    <>
      <JsonLd
        data={getItemListSchema({
          locale,
          path: "/reporting",
          name: translation.title,
          items: visibleReports.map((report) => ({
            name: report.date,
            path: `/reporting/${report.slug}`,
          })),
        })}
      />
      <Reporting
        data={preparedReports}
        translation={translation}
        lang={locale}
        page={query?.page}
      />
      <Contacts />
    </>
  );
}
