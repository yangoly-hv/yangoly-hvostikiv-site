import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";
import {IAngelsProps, Locale} from "@/shared/types";
import {getLocale} from "next-intl/server";
import { getTopDonorBoard } from "@/features/home/server/data";
import { getShowTopDonors } from "@/features/site/server/data";

export default async function Angels({
  title,
  withCircle = true,
  ...props
}: IAngelsProps) {
    const lang = (await getLocale()) as Locale;
    const showTopDonors = await getShowTopDonors();
    if (!showTopDonors) return null;

    const data = await getTopDonorBoard(lang);
    if(!data.length) return null;
  return (
    <section className="mb-[100px] xl:mb-[120px]" {...props}>
      <AngelsMob donors={data} title={title} />
      <AngelsDesk donors={data} withCircle={withCircle} title={title} />
    </section>
  );
}
