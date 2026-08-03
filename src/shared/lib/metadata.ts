import "server-only";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/shared/config/site";
import { locales, localizedPath, siteUrl } from "@/shared/config/site";

type MetadataValues = {
  title: string;
  description: string;
  keywords?: string;
};

type MetadataKey =
  | "blog"
  | "tails"
  | "reporting"
  | "partnership"
  | "volunteering"
  | "charityEvents"
  | "publicOffer";

type PageMetadataOptions = {
  locale: AppLocale;
  path?: string;
  key?: MetadataKey;
  values?: MetadataValues;
  image?: string;
};

export async function getPageMetadata({
  locale,
  path = "",
  key,
  values,
  image = "/images/about/about-us-desk3.webp",
}: PageMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const translated = (key
    ? t.raw(key)
    : {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
      }) as MetadataValues;
  const metadata = values || translated;
  const canonicalPath = localizedPath(locale, path);

  return {
    metadataBase: siteUrl,
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          localizedPath(supportedLocale, path),
        ])
      ),
    },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalPath,
      type: "website",
      locale,
      images: [{ url: image, width: 1200, height: 630, alt: metadata.title }],
    },
  };
}
