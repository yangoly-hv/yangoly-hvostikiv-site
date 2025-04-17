import { IAngelsProps } from "@/shared/types";
import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";

export default function Angels({ translation, lang }: IAngelsProps) {
  return (
    <section className="mb-[100px] xl:mb-[120px]">
      <AngelsMob translation={translation} lang={lang} />
      <AngelsDesk translation={translation} lang={lang} />
    </section>
  );
}
