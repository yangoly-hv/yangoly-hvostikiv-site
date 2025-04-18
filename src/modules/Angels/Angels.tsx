import { IAngelsProps } from "@/shared/types";
import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";

export default function Angels({
  translation,
  lang,
  donateModalTranslataion,
}: IAngelsProps) {
  return (
    <section className="mb-[100px] xl:mb-[120px]">
      <AngelsMob
        translation={translation}
        lang={lang}
        donateModalTranslataion={donateModalTranslataion}
      />
      <AngelsDesk
        translation={translation}
        lang={lang}
        donateModalTranslataion={donateModalTranslataion}
      />
    </section>
  );
}
