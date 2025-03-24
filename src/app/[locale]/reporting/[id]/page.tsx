import Contacts from "@/modules/Contacts/Contacts";
import Report from "@/modules/Report/Report";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
// import { reportingList } from "../constants";

import {getReportById} from "@/shared/api/reports";
import type {Metadata} from "next";

// import {extractFirstParagraphText} from "@/shared/utils/functions";

export async function generateMetadata({
                                         params,
                                       }: PageParams): Promise<Metadata> {
  const { locale, id } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  const data = await getReportById(id, locale);
  const title = `${metadata.reporting.title} | ${data.title} | ${data.date}`;

  return {
    title,
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
    // title: `${metadata.reporting.title} | ${data.title} | ${data.date}`,
    // description: `${metadata.reporting.description} | ${extractFirstParagraphText(data.description)}`,
    // keywords: metadata.reporting.keywords,
    // icons: {
    //   icon: "/favicon.ico",
    // },
    // openGraph: {
    //   title: `${metadata.reporting.title} | ${data.title} | ${data.date}`,
    //   description: `${metadata.reporting.description} | ${extractFirstParagraphText(data.description)}`,
    //   url: `${baseUrl}/${locale}/reporting/${id}`,
    //   type: "website",
    //   locale,
    //   images: [
    //     {
    //       url: data.mainPhoto.url,
    //       width: 1200,
    //       height: 630,
    //       alt: `${metadata.reporting.title} | ${data.title} | ${data.date}`,
    //     },
    //   ],
    // },
  };
}

export default async function ReportPage({ params }: PageParams) {
  const { id, locale } = await params;
  const { contacts } = await getDictionary(locale);

  // const report = reportingList[locale].find(
  //   (reportItem) => reportItem.id === id
  // );

  const data = await getReportById(id, locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <Report report={data} />
      <Contacts translation={contacts} lang={locale} />
    </>
  );
}
