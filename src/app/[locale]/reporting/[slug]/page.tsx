import Contacts from "@/modules/Contacts/Contacts";
import Report from "@/modules/Report/Report";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
// import { reportingList } from "../constants";

// import { getReportById } from "@/shared/api/reports";
import type { Metadata } from "next";

// import { extractFirstParagraphText } from "@/shared/utils/functions";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Loading from "@/app/loading";

import client from "@/shared/lib/sanity";
import {reportBySlugQuery} from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug, } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://yangoly-hvostikiv-site.vercel.app";

  const data = await client.fetch(reportBySlugQuery, {
    slug,
    lang: locale,
  });

  // const data = await getReportById(id, locale);

  const title = `${metadata.reporting.title} | ${data.title} | ${data.date}`;
  const description = `${metadata.reporting.description
    } | ${data.title} | ${data.date}`;

  return {
    title,
    description,
    keywords: metadata.reporting.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title,
      description: `${data.tilte}`,
      url: `${baseUrl}/${locale}/reporting/${slug}`,
      type: "website",
      locale: locale,
      images: [
        {
          url: data.images[0].url,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ReportPage({ params }: PageParams) {
  const { slug, locale } = await params;
  const t = await getTranslations("");
  const blog = await t.raw("Blog");
  // const { blog } = await getDictionary(locale);

  // const report = reportingList[locale].find(
  //   (reportItem) => reportItem.id === id
  // );

  // const data = await getReportById(id, locale);
  const data = await client.fetch(reportBySlugQuery, {
    slug,
    lang: locale,
  });

  if (!data) {
    return null;
  }
  console.log(data);
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Report report={data} translation={blog} />
        <Contacts />
      </Suspense>
    </>
  );
}
