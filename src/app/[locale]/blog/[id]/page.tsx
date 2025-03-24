import Contacts from "@/modules/Contacts/Contacts";
import BlogArticle from "@/modules/BlogArticle/BlogArticle";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
// import { newsList } from "../constants";

// import {extractFirstParagraphText} from "@/shared/utils/functions";

import {getBlogItemById} from "@/shared/api/blog";
import type {Metadata} from "next";

export async function generateMetadata({
                                         params,
                                       }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

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
      url: `${baseUrl}/${locale}/blog`,
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

/*
    // title: `${metadata.blog.title} | ${data.title}`,
    // description: `${metadata.blog.description} | ${extractFirstParagraphText(data.description)}`,
    // keywords: metadata.blog.keywords,
    // icons: {
    //   icon: "/favicon.ico",
    // },
    // openGraph: {
    //   title: `${metadata.blog.title} | ${data.title}`,
    //   description: `${metadata.blog.description} | ${extractFirstParagraphText(data.description)}`,
    //   url: `${baseUrl}/${locale}/blog/${id}`,
    //   type: "website",
    //   locale,
    //   images: [
    //     {
    //       url: data.mainPhoto.url,
    //       width: 1200,
    //       height: 630,
    //       alt: `${metadata.blog.title} | ${data.title}`,
    //     },
    //   ],
    // },
* */

export default async function ArticlePage({ params }: PageParams) {
  const { id, locale } = await params;
  const { contacts, blog } = await getDictionary(locale);

  // const article = newsList[locale].find((newsItem) => newsItem.id === id);

  const data = await getBlogItemById(id, locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <BlogArticle article={data} translation={blog} />
      <Contacts translation={contacts} lang={locale} />
    </>
  );
}
