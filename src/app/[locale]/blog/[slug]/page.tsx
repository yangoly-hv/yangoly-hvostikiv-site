import Contacts from "@/modules/Contacts/Contacts";
import BlogArticle from "@/modules/BlogArticle/BlogArticle";
import BlogArticleWithContent from "@/modules/BlogArticle/BlogArticleWithContent";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import { postBySlugWithContentQuery } from "@/shared/lib/queries";
import type { PostWithContent } from "@/shared/types/blog.types";

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

/** Detect new schema: post has content array with blocks. Legacy has additionalInfo/secondaryImage. */
function hasContentBlocks(
  data: { content?: unknown[] }
): data is { content: unknown[] } {
  return Array.isArray(data.content) && data.content.length > 0;
}

export default async function ArticlePage({ params }: PageParams) {
  const { slug, locale } = await params;
  const t = await getTranslations("");
  const blog = await t.raw("Blog");
  const data = await client.fetch<PostWithContent | null>(
    postBySlugWithContentQuery,
    { lang: locale, slug }
  );

  if (!data) {
    return null;
  }
console.log(data);
  const useNewSchema = hasContentBlocks(data);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {useNewSchema ? (
          <BlogArticleWithContent
            article={data}
            translation={blog}
          />
        ) : (
          <BlogArticle article={data} translation={blog} />
        )}
        <Contacts />
      </Suspense>
    </>
  );
}
