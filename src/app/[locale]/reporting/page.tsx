import Contacts from "@/modules/Contacts/Contacts";
import Reporting from "@/modules/Reporting/Reporting";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";

import { getAllReports } from "@/shared/api/reports";
import type { Metadata } from "next";

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
  const { reporting } = await getDictionary(locale);

  const data = await getAllReports(locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <Reporting data={data} translation={reporting} lang={locale} />
      <Contacts />
    </>
  );
}
