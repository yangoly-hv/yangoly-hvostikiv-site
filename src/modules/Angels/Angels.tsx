import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";
import {IAngelsProps, Locale} from "@/shared/types";
import {getLocale} from "next-intl/server";
import { getTopDonors } from "@/features/home/server/data";

export default async function Angels({
  title,
  withCircle = true,
  ...props
}: IAngelsProps) {
    const lang = (await getLocale()) as Locale;
    const data = await getTopDonors(lang);
    if(!data.length) return null;
  return (
    <section className="mb-[100px] xl:mb-[120px]" {...props}>
      <AngelsMob donors={data} title={title} />
      <AngelsDesk donors={data} withCircle={withCircle} title={title} />
    </section>
  );
}
