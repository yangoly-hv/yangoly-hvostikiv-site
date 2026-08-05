import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Contacts from "@/modules/Contacts/Contacts";
import Tails from "@/modules/Tails/Tails";
import { getAllTails } from "@/features/tails/server/data";
import { mapTail } from "@/features/tails/model/mapTail";
import type { PageParams } from "@/shared/types";
import { getPageMetadata } from "@/shared/lib/metadata";
import type { IFilterOption } from "@/shared/types";
import { getPageNumber } from "@/shared/lib/pagination";
import { getItemListSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "tails", path: "/tails" });
}

export default async function TailsPage({ params, searchParams }: PageParams) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const [data, t] = await Promise.all([
    getAllTails(locale),
    getTranslations({ locale }),
  ]);
  const translation = t.raw("Tails");
  const tails = data.map((tail) => mapTail(tail, locale));
  const filterOptions = [
    { label: t("Filters.allTails"), value: "all" },
    { label: t("Filters.needsSterilization"), value: "needs-sterilization" },
    { label: t("Filters.needsFamily"), value: "needs-family" },
    { label: t("Filters.adopted"), value: "adopted" },
  ] satisfies IFilterOption[];
  const filter = filterOptions.some((option) => option.value === query?.filter)
    ? query?.filter || "all"
    : "all";
  const filteredTails =
    filter === "all"
      ? tails
      : tails.filter((tail) => tail.categories.includes(filter));
  const currentPage = getPageNumber(query?.page, Math.ceil(filteredTails.length / 8));
  const visibleTails = filteredTails.slice((currentPage - 1) * 8, currentPage * 8);

  return (
    <>
      <JsonLd
        data={getItemListSchema({
          locale,
          path: "/tails",
          name: translation.allTails,
          items: visibleTails.map((tail) => ({
            name: tail.name,
            path: `/tails/${tail.slug}`,
            image: tail.image,
          })),
        })}
      />
      <Tails
        data={tails}
        translation={translation}
        lang={locale}
        filter={filter}
        page={query?.page}
        filterOptions={filterOptions}
      />
      <Contacts />
    </>
  );
}
