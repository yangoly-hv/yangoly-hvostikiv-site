import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import Tails from "@/modules/Tails/Tails";
import { getAllTails } from "@/features/tails/server/data";
import { mapTail } from "@/features/tails/model/mapTail";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "tails", path: "/tails" });
}

export default async function TailsPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [data, t] = await Promise.all([
    getAllTails(locale),
    getTranslations({ locale }),
  ]);
  const translation = t.raw("Tails");
  const tails = data.map((tail) => mapTail(tail, locale));

  return (
    <>
      <Tails data={tails} translation={translation} lang={locale} />
      <Contacts />
    </>
  );
}
