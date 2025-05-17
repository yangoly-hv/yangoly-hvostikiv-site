import Contacts from "@/modules/Contacts/Contacts";
import Reporting from "@/modules/Reporting/Reporting";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";

// import { getAllReports } from "@/shared/api/reports";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Loading from "@/app/loading";

import client from "@/shared/lib/sanity";
import {allReportsQuery} from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  return {
    title: metadata.reporting.title,
    description: metadata.reporting.description,
    keywords: metadata.reporting.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.reporting.title,
      description: metadata.reporting.description,
      url: `${baseUrl}/${locale}/reporting`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.reporting.title,
        },
      ],
    },
  };
}

export default async function ReportingPage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations("");
  const reporting = await t.raw("Reporting");
  // const { reporting } = await getDictionary(locale);
  const reports = await client.fetch(allReportsQuery);

  // const data = await getAllReports(locale);
  //@ts-expect-error
  const data = reports.map(({_id, slug, date}) => ({_id, slug, date: date[locale]}));

  if (!data) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Reporting data={data} translation={reporting} lang={locale} />
        <Contacts />
      </Suspense>
    </>
  );
}
