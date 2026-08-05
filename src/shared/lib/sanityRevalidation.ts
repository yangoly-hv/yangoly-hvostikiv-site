import type { AppLocale } from "@/shared/config/site";
import { locales, localizedPath } from "@/shared/config/site";
import {
  sanityTags,
  type SupportedSanityDocumentType,
} from "@/shared/lib/sanityTags";

export type SanityWebhookOperation = "create" | "update" | "delete";

export type SanityWebhookPayload = {
  _id: string;
  _type: SupportedSanityDocumentType;
  operation?: SanityWebhookOperation;
  oldSlug?: string | null;
  newSlug?: string | null;
};

type RevalidationTarget = {
  tags: string[];
  paths: string[];
};

const localizedPaths = (path = "") =>
  locales.map((locale: AppLocale) => localizedPath(locale, path));

const addSlugTargets = (
  target: RevalidationTarget,
  slug: string | null | undefined,
  pathPrefix: string,
  tag: (slug: string) => string
) => {
  if (!slug) return;
  target.tags.push(tag(slug));
  target.paths.push(...localizedPaths(`${pathPrefix}/${slug}`));
};

export const getRevalidationTargets = (
  payload: SanityWebhookPayload
): RevalidationTarget => {
  const target: RevalidationTarget = { tags: [], paths: [] };

  switch (payload._type) {
    case "post":
      target.tags.push(sanityTags.blogList, sanityTags.sitemap);
      target.paths.push(...localizedPaths("/blog"));
      addSlugTargets(target, payload.oldSlug, "/blog", sanityTags.blogPost);
      addSlugTargets(target, payload.newSlug, "/blog", sanityTags.blogPost);
      break;
    case "tail":
      target.tags.push(sanityTags.tailsList, sanityTags.sitemap);
      target.paths.push(...localizedPaths("/tails"));
      addSlugTargets(target, payload.oldSlug, "/tails", sanityTags.tail);
      addSlugTargets(target, payload.newSlug, "/tails", sanityTags.tail);
      break;
    case "reports":
      target.tags.push(sanityTags.reportsList, sanityTags.sitemap);
      target.paths.push(...localizedPaths("/reporting"));
      addSlugTargets(target, payload.oldSlug, "/reporting", sanityTags.report);
      addSlugTargets(target, payload.newSlug, "/reporting", sanityTags.report);
      break;
    case "donator":
      target.tags.push(sanityTags.donorsList);
      target.paths.push(...localizedPaths());
      break;
    case "collection":
      target.tags.push(sanityTags.collectionMain);
      target.paths.push(...localizedPaths());
      break;
    case "perfomance":
      target.tags.push(sanityTags.performance);
      target.paths.push(...localizedPaths());
      break;
    case "partner":
      target.tags.push(sanityTags.partnersList);
      target.paths.push(...localizedPaths("/partnership"));
      break;
    case "aboutFoundation":
      target.tags.push(sanityTags.about);
      target.paths.push(...localizedPaths());
      break;
    case "events":
      target.tags.push(sanityTags.events);
      target.paths.push(...localizedPaths("/charity-events"));
      break;
  }

  return {
    tags: [...new Set(target.tags)],
    paths: [...new Set(target.paths)],
  };
};
