import { IVolunteeringCardProps } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";
import VolunteeringCardContent from "./VolunteeringCardContent";
import VolunteeringCardFrame from "./VolunteeringCardFrame";

const VolunteeringCardDesk = ({
  index,
  item,
  className,
}: IVolunteeringCardProps) => {
  return (
    <VolunteeringCardFrame
      index={index}
      backgroundColor={item.bg}
      className={clsx(
        "py-[32px] rounded-[8px] relative flex flex-col overflow-hidden grow",
        className
      )}
    >
      <VolunteeringCardContent index={index} item={item} />
      {item.imagePathDesk && (
        <div
          className={clsx(
            "absolute z-1",
            index === 0 &&
              "right-[-15px] bottom-0 w-[250px] h-[400px] laptop:w-[350px] laptop:h-[526px]",
            index === 3 &&
              "right-[-130px] bottom-[-35px] w-[448px] h-[363px] laptop:w-[548px] laptop:h-[536px] laptop:right-[-150px] laptop:bottom-[-90px]",
            index === 2 &&
              "right-[-25px] bottom-1 w-[283px] h-[336px] laptop:w-[243px] laptop:h-[456px] laptop:bottom-[-50px]",
            index === 1 &&
              "right-[-15px] bottom-[-15px] w-[285px] laptop:w-[307px] h-[246px] "
          )}
        >
          <Image
            src={item.imagePathDesk}
            alt="Volunteering Image"
            fill
            className="object-contain"
          />
        </div>
      )}
    </VolunteeringCardFrame>
  );
};

export default VolunteeringCardDesk;
