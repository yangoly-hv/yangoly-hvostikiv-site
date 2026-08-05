import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Blog from "@/modules/Blog/Blog";
import Contacts from "@/modules/Contacts/Contacts";
import { getAllPosts } from "@/features/blog/server/data";
import { mapBlogPostSummary } from "@/features/blog/model/mapBlogPost";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";
import { getPageNumber } from "@/shared/lib/pagination";
import { getItemListSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "blog", path: "/blog" });
}

export default async function BlogPage({ params, searchParams }: PageParams) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const [posts, t] = await Promise.all([
    getAllPosts(locale),
    getTranslations({ locale }),
  ]);

  const preparedPosts = posts.map((post) => mapBlogPostSummary(post, locale));
  const currentPage = getPageNumber(query?.page, Math.ceil(preparedPosts.length / 8));
  const visiblePosts = preparedPosts.slice((currentPage - 1) * 8, currentPage * 8);
  const translation = t.raw("Blog");

  return (
    <>
      <JsonLd
        data={getItemListSchema({
          locale,
          path: "/blog",
          name: translation.title,
          items: visiblePosts.map((post) => ({
            name: post.title,
            path: `/blog/${post.slug}`,
            image: post.mainPhoto,
          })),
        })}
      />
      <Blog
        data={preparedPosts}
        translation={translation}
        page={query?.page}
      />
      <Contacts />
    </>
  );
}
