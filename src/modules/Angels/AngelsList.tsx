import { donorsList } from "./mockedData";
import {
  listVariants,
  fadeInAnimation,
} from "@/shared/components/Animations/animationVariants";
import { IAngelsListProps } from "@/shared/types";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AnimatedListItem from "@/shared/components/Animations/AnimatedListItem";

export default function AngelsList({ lang, translation }: IAngelsListProps) {
  if (!donorsList || !donorsList[lang] || !donorsList[lang].length) return null;

  const { hrn, donor, sum } = translation;

  const formatSum = (value: number): string => {
    return new Intl.NumberFormat("uk-UA", {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace(/\u00A0/g, " ");
  };

  return (
    <div className="md:w-[45.7%] desk:w-[37%] xl:mt-5">
      <AnimatedWrapper
        animation={fadeInAnimation({ y: 30 })}
        className="grid grid-cols-[1fr_2.5fr_1.5fr] mb-6 py-3 border-b border-orange text-[16px] xl:text-[24px] font-semibold leading-[122%] 
      xl:leading-[81%]"
      >
        <p>#</p>
        <p>{donor}</p>
        <p>{sum}</p>
      </AnimatedWrapper>
      <AnimatedWrapper
        as="ul"
        animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
        className="flex flex-col gap-y-6"
      >
        {donorsList[lang].map((donor, idx) => (
          <AnimatedListItem
            key={idx}
            className="grid grid-cols-[1fr_2.5fr_1.5fr] py-[11px] border-b border-orange text-[14px] xl:text-[20px] leading-[139%] xl:leading-[97%]"
          >
            <p>{idx + 1}</p>
            <p>{donor?.name}</p>
            <p className="text-right">
              {formatSum(donor?.sum)}&nbsp;{hrn}
            </p>
          </AnimatedListItem>
        ))}
      </AnimatedWrapper>
    </div>
  );
}
