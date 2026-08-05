import type { MetadataRoute } from "next";

import { getAllPostSlugs } from "@/features/blog/server/data";
import { getAllReportSlugs } from "@/features/reports/server/data";
import { getAllTailSlugs } from "@/features/tails/server/data";
import {
  locales,
  localizedPath,
  siteUrl,
  staticPagePaths,
} from "@/shared/config/site";

const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedContent = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await getAllPostSlugs(locale),
      reports: await getAllReportSlugs(locale),
      tails: await getAllTailSlugs(locale),
    }))
  );

  const entries: MetadataRoute.Sitemap = [];

  for (const { locale, posts, reports, tails } of localizedContent) {
    for (const path of staticPagePaths) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, path)),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const { slug, updatedAt } of posts) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/blog/${slug}`)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const { slug, updatedAt } of reports) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/reporting/${slug}`)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const { slug, updatedAt } of tails) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/tails/${slug}`)),
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
