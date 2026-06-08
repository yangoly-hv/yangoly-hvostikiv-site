import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";
import {IAngelsProps, Locale} from "@/shared/types";

import client from "@/shared/lib/sanity";
import {topDotatorsQuery} from "@/shared/lib/queries";
import {getLocale} from "next-intl/server";

export default async function Angels({
  title,
  withCircle = true,
  ...props
}: IAngelsProps) {
    const lang = (await getLocale()) as Locale;
    const data = await client.fetch(topDotatorsQuery, {
        lang,
    });
    if(!data.length) return null;
  return (
    <section className="mb-[100px] xl:mb-[120px]" {...props}>
      <AngelsMob title={title} />
      <AngelsDesk withCircle={withCircle} title={title} />
    </section>
  );
}
