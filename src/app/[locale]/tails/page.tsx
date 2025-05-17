import Contacts from "@/modules/Contacts/Contacts";
import Tails from "@/modules/Tails/Tails";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
import type { Metadata } from "next";
import { getAllAnimals } from "@/shared/api/animals";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {allTailsQuery} from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  return {
    title: metadata.tails.title,
    description: metadata.tails.description,
    keywords: metadata.tails.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.tails.title,
      description: metadata.tails.description,
      url: `${baseUrl}/${locale}/tails`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.tails.title,
        },
      ],
    },
  };
}

export default async function TailsPage({ params }: PageParams) {
  const { locale } = await params;
  const tails = (await getTranslations("")).raw("Tails");

  // const data = await getAllAnimals(locale);
  const data = await client.fetch(allTailsQuery, {
    lang: locale,
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Tails data={data} translation={tails} lang={locale} />
        <Contacts />
      </Suspense>
    </>
  );
}
