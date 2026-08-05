import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/shared/config/site";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import type { BlogPost } from "../model/types";
import { allPostSlugsQuery, allPostsQuery, postBySlugQuery } from "./queries";

export const getAllPosts = cache((locale: AppLocale) =>
  sanityFetch<BlogPost[]>(
    allPostsQuery,
    { lang: locale },
    { tags: [sanityTags.blogList] }
  )
);

export const getPostBySlug = cache((locale: AppLocale, slug: string) =>
  sanityFetch<BlogPost | null>(
    postBySlugQuery,
    { lang: locale, slug },
    { tags: [sanityTags.blogPost(slug)] }
  )
);

export type ContentSlug = { slug: string; updatedAt?: string };

export const getAllPostSlugs = cache(async (locale: AppLocale) => {
  const rows = await sanityFetch<ContentSlug[]>(
    allPostSlugsQuery,
    { lang: locale },
    { tags: [sanityTags.blogList, sanityTags.sitemap] }
  );
  return rows;
});
