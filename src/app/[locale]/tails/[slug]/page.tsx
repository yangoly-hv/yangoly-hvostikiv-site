import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Tail from "@/modules/Tail/Tail";
import Contacts from "@/modules/Contacts/Contacts";
import {
  getAllTails,
  getAllTailSlugs,
  getTailBySlug,
} from "@/features/tails/server/data";
import { mapTail } from "@/features/tails/model/mapTail";
import { locales } from "@/shared/config/site";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllTailSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: PageParams<{ slug: string }>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slug) return getPageMetadata({ locale, key: "tails", path: "/tails" });

  const [tail, t] = await Promise.all([
    getTailBySlug(locale, slug),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);
  const fallback = t.raw("tails") as {
    title: string;
    description: string;
    keywords: string;
  };

  if (!tail) {
    return getPageMetadata({ locale, key: "tails", path: `/tails/${slug}` });
  }

  const firstDescription = tail.description?.[0]?.children?.[0]?.text;
  const title = `${fallback.title} | ${tail.name}`;

  return getPageMetadata({
    locale,
    path: `/tails/${slug}`,
    values: {
      title,
      description: firstDescription || fallback.description,
      keywords: fallback.keywords,
    },
    image: tail.mainImageUrl,
  });
}

const selectRelatedTails = <T extends { slug: string }>(
  tails: T[],
  currentSlug: string,
  limit: number
) => {
  const candidates = tails.filter((tail) => tail.slug !== currentSlug);
  const offset = [...currentSlug].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return [...candidates.slice(offset % Math.max(candidates.length, 1)), ...candidates].slice(
    0,
    Math.min(limit, candidates.length)
  );
};

export default async function TailPage({ params }: PageParams<{ slug: string }>) {
  const { slug, locale } = await params;
  if (!slug) notFound();

  setRequestLocale(locale);
  const [tail, allTails, t] = await Promise.all([
    getTailBySlug(locale, slug),
    getAllTails(locale),
    getTranslations({ locale }),
  ]);

  if (!tail) notFound();

  const translation = t.raw("Tails");
  const related = selectRelatedTails(allTails, slug, 4).map((item) =>
    mapTail(item, locale)
  );

  return (
    <>
      <Tail
        translation={translation}
        locale={locale}
        tail={mapTail(tail, locale)}
        randomTails={related}
      />
      <Contacts />
    </>
  );
}
