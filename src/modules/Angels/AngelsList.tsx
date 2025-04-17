import { donorsList } from "./mockedData";
import { IAngelsListProps } from "@/shared/types";

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
    <div>
      <div
        className="grid grid-cols-[1fr_2.5fr_1.5fr] mb-6 py-3 border-b border-orange text-[16px] xl:text-[24px] font-semibold leading-[122%] 
      xl:leading-[81%]"
      >
        <p>#</p>
        <p>{donor}</p>
        <p>{sum}</p>
      </div>
      <ul className="flex flex-col gap-y-6">
        {donorsList[lang].map((donor, idx) => (
          <li
            key={idx}
            className="grid grid-cols-[1fr_2.5fr_1.5fr] py-3 border-b border-orange text-[14px] xl:text-[20px] leading-[139%]"
          >
            <p>{idx + 1}</p>
            <p>{donor?.name}</p>
            <p className="text-right">
              {formatSum(donor?.sum)}&nbsp;{hrn}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
