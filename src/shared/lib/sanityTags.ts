export const sanityTags = {
  about: "about",
  blogList: "blog:list",
  collectionMain: "collection:main",
  donorsList: "donors:list",
  events: "events",
  performance: "performance",
  partnersList: "partners:list",
  reportsList: "reports:list",
  sitemap: "sitemap",
  tailsList: "tails:list",
  blogPost: (slug: string) => `blog:${slug}`,
  report: (slug: string) => `report:${slug}`,
  tail: (slug: string) => `tail:${slug}`,
} as const;

export const supportedSanityDocumentTypes = [
  "post",
  "tail",
  "reports",
  "donator",
  "collection",
  "perfomance",
  "partner",
  "aboutFoundation",
  "events",
] as const;

export type SupportedSanityDocumentType =
  (typeof supportedSanityDocumentTypes)[number];

export const isSupportedSanityDocumentType = (
  value: string
): value is SupportedSanityDocumentType =>
  supportedSanityDocumentTypes.includes(value as SupportedSanityDocumentType);
