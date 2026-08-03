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

export const getAllTailSlugs = cache(async () => {
  const rows = await sanityFetch<Array<{ slug: string }>>(
    allTailSlugsQuery,
    {},
    { tags: [sanityTags.tailsList, sanityTags.sitemap] }
  );
  return rows.map(({ slug }) => slug);
});
