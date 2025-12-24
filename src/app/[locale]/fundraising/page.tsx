import Hero from "../../../shared/components/ChairtyBlocks/Hero";
import { getTranslations } from "next-intl/server";
import { PageParams, IMetadata } from "@/shared/types";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";

import client from "@/shared/lib/sanity";
import { eventsQuery } from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const metadata = (await t.raw("charityEvents")) as IMetadata;
  const { locale } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}/blog`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
  };
}

// const slides = [
//   "/images/chairty5.jpg",
//   "/images/partners1.jpg",
//   "/images/partners2.jpg",
//   "/images/partners3.jpg",
//   "/images/partners4.jpg",
//   "/images/partners1.jpg",
//   "/images/partners2.jpg",
//   "/images/partners3.jpg",
//   "/images/partners4.jpg",
//   "/images/partners1.jpg",
//   "/images/partners2.jpg",
//   "/images/partners3.jpg",
//   "/images/partners4.jpg",
// ];

export default async function CharityEventPage({ params }: PageParams) {
  const t = await getTranslations("ChairtyEvents");
  // const paragraphs = await t.raw("paragraphs");
  const { locale } = await params;
  const { title, images } = await client.fetch(eventsQuery);
  // const pageTitle = title[locale];

  return (
    <Suspense fallback={<Loading />}>
      <section className="bg-orange-bg">
        <Hero title={t("title")} images={[]} />
      </section>
    </Suspense>
  );
}
