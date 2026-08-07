import "server-only";

import { localizedPath, siteUrl, type AppLocale } from "@/shared/config/site";

const organizationId = new URL("/#organization", siteUrl).toString();
const organizationName = (locale: AppLocale) =>
  locale === "uk"
    ? "Благодійний фонд «Янголи Хвостиків»"
    : "Angels of Tails Charity Foundation";

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

function getOrganizationReference(locale: AppLocale) {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: organizationName(locale),
    url: absoluteUrl(localizedPath(locale)),
  };
}

export function getOrganizationSchema(
  locale: AppLocale,
  sameAs: string[] = []
) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": organizationId,
    name: organizationName(locale),
    alternateName: "Янголи Хвостиків",
    url: siteUrl.toString(),
    logo: absoluteUrl("/images/logo.webp"),
    email: "angelsuaorg@gmail.com",
    telephone: "+380972002400",
    address: {
      "@type": "PostalAddress",
      streetAddress: "проспект Павла Тичини, 4",
      addressLocality: "Київ",
      postalCode: "02098",
      addressCountry: "UA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380972002400",
      email: "angelsuaorg@gmail.com",
      contactType: "customer support",
      availableLanguage: ["uk", "en"],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function getWebSiteSchema(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl(`${localizedPath(locale)}#website`),
    name: locale === "uk" ? "Янголи Хвостиків" : "Angels of Tails",
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
    publisher: getOrganizationReference(locale),
  };
}

type WebPageSchemaOptions = {
  locale: AppLocale;
  path: string;
  name: string;
  description: string;
};

export function getWebPageSchema({ locale, path, name, description }: WebPageSchemaOptions) {
  const pageUrl = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    name,
    description,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { "@id": absoluteUrl(`${localizedPath(locale)}#website`) },
    about: getOrganizationReference(locale),
  };
}

export function getBreadcrumbSchema(
  locale: AppLocale,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

type ArticleSchemaOptions = {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  dateCreated?: string;
};

export function getArticleSchema({
  locale,
  path,
  title,
  description,
  image,
  datePublished,
  dateModified,
  dateCreated,
}: ArticleSchemaOptions) {
  const pageUrl = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    dateCreated: dateCreated ?? datePublished,
    inLanguage: locale,
    author: getOrganizationReference(locale),
    publisher: getOrganizationReference(locale),
  };
}

type ReportSchemaOptions = {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  reportFileUrl?: string;
  reportFileName?: string;
};

export function getReportSchema({
  locale,
  path,
  title,
  description,
  image,
  datePublished,
  dateModified,
  reportFileUrl,
  reportFileName,
}: ReportSchemaOptions) {
  const pageUrl = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "Report",
    "@id": `${pageUrl}#report`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale,
    author: getOrganizationReference(locale),
    publisher: getOrganizationReference(locale),
    encoding: reportFileUrl
      ? {
          "@type": "MediaObject",
          contentUrl: reportFileUrl,
          name: reportFileName,
        }
      : undefined,
  };
}

type ItemPageSchemaOptions = {
  locale: AppLocale;
  path: string;
  name: string;
  description: string;
  image?: string;
  dateModified?: string;
};

export function getItemPageSchema({
  locale,
  path,
  name,
  description,
  image,
  dateModified,
}: ItemPageSchemaOptions) {
  const pageUrl = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": pageUrl,
    name,
    description,
    primaryImageOfPage: image,
    dateModified,
    inLanguage: locale,
    isPartOf: { "@id": absoluteUrl(`${localizedPath(locale)}#website`) },
    mainEntity: {
      "@type": "Thing",
      "@id": `${pageUrl}#tail`,
      name,
      description,
      image,
    },
  };
}

type ItemListSchemaOptions = {
  locale: AppLocale;
  path: string;
  name: string;
  items: Array<{ name: string; path: string; image?: string }>;
};

export function getItemListSchema({ locale, path, name, items }: ItemListSchemaOptions) {
  const pageUrl = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#item-list`,
    name,
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: item.name,
        url: absoluteUrl(localizedPath(locale, item.path)),
        image: item.image,
      },
    })),
  };
}
