import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import Reporting from "@/modules/Reporting/Reporting";
import { getAllReports } from "@/features/reports/server/data";
import { formatReportDate } from "@/features/reports/model/formatReportDate";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

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

export default async function ReportingPage({ params }: PageParams) {
  const { locale } = await params;
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

  return (
    <>
      <Reporting
        data={preparedReports}
        translation={t.raw("Reporting")}
        lang={locale}
      />
      <Contacts />
    </>
  );
}
