import Tail from "@/modules/Tail/Tail";
import Contacts from "@/modules/Contacts/Contacts";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
// import { tails } from "../constans";

import { getAnimalById, getAllAnimals } from "@/shared/api/animals";
import type { Metadata } from "next";
import { extractFirstParagraphText } from "@/shared/utils/functions";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {allTailsQuery, tailBySlugQuery} from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  const data = await client.fetch(tailBySlugQuery, {
    slug,
    lang: locale,
  });

  // const data = await getAnimalById(id, locale);
  const title = `${metadata.tails.title} | ${data.name}`;
  const description = `${
    metadata.tails.description
  } | ${data.description[0].children[0].text}`;

  return {
    title,
    description,
    keywords: metadata.tails.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/tails/${slug}`,
      type: "website",
      locale,
      images: [
        {
          url: data.mainImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function TailPage({ params }: PageParams) {
  const { slug, locale } = await params;
  // const tail = tails[locale].find((tail) => tail.id === id);
  // const tail = tails[locale].find((tail) => tail.id === "tail-1");
  const translation = (await getTranslations("")).raw("Tails");

  // const data = await getAnimalById(id, locale);
  const data = await client.fetch(tailBySlugQuery, {
    slug,
    lang: locale,
  });

  // const allData = await getAllAnimals(locale);

  const allData = await client.fetch(allTailsQuery, {
    lang: locale,
  });
  if (!data) {
    return null;
  }
  //@ts-expect-error
  const otherTails = allData.filter((item) => item.slug !== data.slug);
  const randomTails = otherTails.sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Tail
          translation={translation}
          locale={locale}
          tail={data}
          randomTails={randomTails}
        />
        <Contacts />
      </Suspense>
    </>
  );
}
