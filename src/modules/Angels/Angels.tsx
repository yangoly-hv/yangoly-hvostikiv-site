import AngelsMob from "./AngelsMob";
import AngelsDesk from "./AngelsDesk";
import { IAngelsProps } from "@/shared/types";
export default async function Angels({
  title,
  withCircle = true,
  ...props
}: IAngelsProps) {
  return (
    <section className="mb-[100px] xl:mb-[120px]" {...props}>
      <AngelsMob title={title} />
      <AngelsDesk withCircle={withCircle} title={title} />
    </section>
  );
}
