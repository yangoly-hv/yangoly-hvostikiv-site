import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/shared/config/site";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import type { TailDocument } from "../model/types";
import {
  allTailSlugsQuery,
  allTailsQuery,
  tailBySlugQuery,
} from "./queries";

export const getAllTails = cache((locale: AppLocale) =>
  sanityFetch<TailDocument[]>(
    allTailsQuery,
    { lang: locale },
    { tags: [sanityTags.tailsList] }
  )
);

export const getTailBySlug = cache((locale: AppLocale, slug: string) =>
  sanityFetch<TailDocument | null>(
    tailBySlugQuery,
    { lang: locale, slug },
    { tags: [sanityTags.tail(slug)] }
  )
);

export type TailSlug = { slug: string; updatedAt?: string };

export const getAllTailSlugs = cache(async (locale: AppLocale) => {
  const rows = await sanityFetch<TailSlug[]>(
    allTailSlugsQuery,
    { lang: locale },
    { tags: [sanityTags.tailsList, sanityTags.sitemap] }
  );
  return rows;
});
