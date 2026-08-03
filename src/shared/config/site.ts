export const locales = ["uk", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "uk";

export const isAppLocale = (value: string): value is AppLocale =>
  locales.includes(value as AppLocale);

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://angelsua.org"
);

export const staticPagePaths = [
  "",
  "/blog",
  "/charity-events",
  "/fundraising",
  "/partnership",
  "/public-offer",
  "/reporting",
  "/tails",
  "/volunteering",
] as const;

export const localizedPath = (locale: AppLocale, path = "") =>
  `/${locale}${path}`;
