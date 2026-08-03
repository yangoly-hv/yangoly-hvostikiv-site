import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import BlogArticle from "@/modules/BlogArticle/BlogArticle";
import BlogArticleWithContent from "@/modules/BlogArticle/BlogArticleWithContent";
import { getAllPostSlugs, getPostBySlug } from "@/features/blog/server/data";
import { locales } from "@/shared/config/site";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: PageParams<{ slug: string }>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slug) return getPageMetadata({ locale, key: "blog", path: "/blog" });

  const [post, t] = await Promise.all([
    getPostBySlug(locale, slug),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);
  const fallback = t.raw("blog") as {
    title: string;
    description: string;
    keywords: string;
  };

  return getPageMetadata({
    locale,
    path: `/blog/${slug}`,
    values: post
      ? {
          title: `${fallback.title} | ${post.title}`,
          description: fallback.description,
          keywords: fallback.keywords,
        }
      : fallback,
    image: post?.mainImage,
  });
}

export default async function ArticlePage({ params }: PageParams<{ slug: string }>) {
  const { slug, locale } = await params;
  if (!slug) notFound();

  setRequestLocale(locale);
  const [post, t] = await Promise.all([
    getPostBySlug(locale, slug),
    getTranslations({ locale }),
  ]);

  if (!post) notFound();

  const translation = t.raw("Blog");
  const hasContent = Array.isArray(post.content) && post.content.length > 0;

  return (
    <>
      {hasContent ? (
        <BlogArticleWithContent article={post} translation={translation} />
      ) : (
        <BlogArticle article={post} translation={translation} />
      )}
      <Contacts />
    </>
  );
}
