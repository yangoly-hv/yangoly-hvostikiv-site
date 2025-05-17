import Contacts from "@/modules/Contacts/Contacts";
import BlogArticle from "@/modules/BlogArticle/BlogArticle";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
// import { newsList } from "../constants";

// import {extractFirstParagraphText} from "@/shared/utils/functions";

import { getBlogItemById } from "@/shared/api/blog";
import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {postBySlugQuery} from "@/shared/lib/queries";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://yangoly-hvostikiv-site.vercel.app";

  return {
    title: metadata.blog.title,
    description: metadata.blog.description,
    keywords: metadata.blog.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.blog.title,
      description: metadata.blog.description,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.blog.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: PageParams) {
  const { slug, locale } = await params;
  const t = await getTranslations("");
  const blog = await t.raw("Blog");
  const data = await client.fetch(postBySlugQuery, {
    lang: locale,
    slug,
  })
  // const article = newsList[locale].find((newsItem) => newsItem.id === id);

  // const data = await getBlogItemById(id, locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <BlogArticle article={data} translation={blog} />
        <Contacts />
      </Suspense>
    </>
  );
}
