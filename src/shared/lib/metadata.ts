import "server-only";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/shared/config/site";
import { defaultLocale, locales, localizedPath, siteUrl } from "@/shared/config/site";

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
  | "publicOffer"
  | "eventRegistration";

type PageMetadataOptions = {
  locale: AppLocale;
  path?: string;
  key?: MetadataKey;
  values?: MetadataValues;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export async function getPageMetadata({
  locale,
  path = "",
  key,
  values,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
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
  const alternateLanguages = Object.fromEntries(
    locales.map((supportedLocale) => [
      supportedLocale,
      localizedPath(supportedLocale, path),
    ])
  );
  const socialImageUrl = image ?? localizedPath(locale, "/opengraph-image");
  const socialImage = [
    {
      url: new URL(socialImageUrl, siteUrl).toString(),
      alt: imageAlt ?? metadata.title,
    },
  ];

  return {
    metadataBase: siteUrl,
    applicationName: "Янголи Хвостиків",
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...alternateLanguages,
        "x-default": localizedPath(defaultLocale, path),
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: "/apple-touch-icon.png",
    },
    verification: {
      other: {
        "facebook-domain-verification": "cxpcls30yzkm7jisl8d6oz9i3umuk4",
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: new URL(canonicalPath, siteUrl).toString(),
      type,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      siteName: "Янголи Хвостиків",
      images: socialImage,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: socialImage?.map((item) => item.url),
    },
  };
}
