import { IVolunteeringCardProps } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";
import VolunteeringCardContent from "./VolunteeringCardContent";
import VolunteeringCardFrame from "./VolunteeringCardFrame";

const VolunteeringCardMobile = ({
  index,
  item,
  className,
}: IVolunteeringCardProps) => {
  return (
    <VolunteeringCardFrame
      index={index}
      backgroundColor={item.bg}
      className={clsx("pt-[32px] rounded-[8px] flex flex-col", className)}
    >
      <VolunteeringCardContent index={index} item={item} mobile />
      <div
        className={clsx(
          "relative w-full mx-auto mt-auto ",
          index === 0 && "w-full aspect-223/204",
          index === 1 && "aspect-330/264",
          index === 2 && "aspect-329/410",
          index === 3 && "aspect-448/299"
        )}
      >
        <Image
          src={item.imagePath}
          alt="Volunteering"
          fill
          className="object-bottom"
        />
      </div>
    </VolunteeringCardFrame>
  );
};

export default VolunteeringCardMobile;
