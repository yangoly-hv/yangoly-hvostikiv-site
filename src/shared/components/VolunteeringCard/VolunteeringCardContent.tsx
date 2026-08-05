import clsx from "clsx";

import type { IVolunteeringCardProps } from "@/shared/types";

type VolunteeringCardContentProps = Pick<
  IVolunteeringCardProps,
  "index" | "item"
> & {
  mobile?: boolean;
};

export default function VolunteeringCardContent({
  index,
  item,
  mobile = false,
}: VolunteeringCardContentProps) {
  return (
    <div className={mobile ? "px-4" : "z-2 px-4 pl-[36px]"}>
      <h3
        className={clsx(
          "mb-3 font-arial tracking-[-0.225px] leading-[141%] whitespace-pre-line",
          mobile ? "text-[24px] lg:text-[32px]" : "text-[32px]",
          !mobile && index === 0 && "w-full max-w-[420px]",
          !mobile && index === 1 && "w-full max-w-[561px]",
        )}
      >
        {item.title}
      </h3>
      {item.text && (
        <p className={mobile ? "mb-4 text-[14px] leading-[133%] lg:text-[18px]" : "mb-4 text-[18px] leading-[133%]"}>
          {item.text}
        </p>
      )}
      {item.listLabel && (
        <p className={mobile ? "mb-2 text-[14px] font-medium leading-[133%] lg:text-[18px]" : "mb-2 text-[18px] font-medium leading-[133%]"}>
          {item.listLabel}
        </p>
      )}
      <ul
        className={clsx(
          "grid grid-cols-1 gap-2 list-disc",
          mobile ? "ml-[18px] pl-5" : "ml-[20px]",
          !mobile && index === 0 && "max-w-[420px]",
          !mobile && index === 3 && "w-full max-w-[393px]",
          !mobile && index === 2 && "w-full max-w-[446px]",
          !mobile && index === 1 && "w-full max-w-[353px]",
        )}
      >
        {item.paragraphs?.map((paragraph, paragraphIndex) => (
          <li
            className={clsx(
              "px-[10px] tracking-[-0.225px] leading-[114%]",
              mobile ? "text-[14px] lg:text-[18px]" : "text-[18px]",
              !mobile && paragraphIndex === 3 && "max-w-[384px]",
            )}
            key={paragraphIndex}
          >
            {paragraph}
          </li>
        ))}
      </ul>
    </div>
  );
}
