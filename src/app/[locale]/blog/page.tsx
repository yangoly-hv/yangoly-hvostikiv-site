import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Blog from "@/modules/Blog/Blog";
import Contacts from "@/modules/Contacts/Contacts";
import { getAllPosts } from "@/features/blog/server/data";
import { mapBlogPostSummary } from "@/features/blog/model/mapBlogPost";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "blog", path: "/blog" });
}

export default async function BlogPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, t] = await Promise.all([
    getAllPosts(locale),
    getTranslations({ locale }),
  ]);

  return (
    <>
      <Blog
        data={posts.map((post) => mapBlogPostSummary(post, locale))}
        translation={t.raw("Blog")}
      />
      <Contacts />
    </>
  );
}
