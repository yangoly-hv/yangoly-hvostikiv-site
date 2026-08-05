import { IFilterOption } from "@/shared/types";

type FilterProps = {
  selectedFilter: string;
  options: IFilterOption[];
};

export default function Filter({ selectedFilter, options }: FilterProps) {

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-y-3 lg:gap-x-[44px] mb-10 lg:mb-[44px]">
      {options.map((filter) => (
        <a
          key={filter.value}
          href={filter.value === "all" ? "?" : `?filter=${filter.value}`}
          aria-current={selectedFilter === filter.value ? "page" : undefined}
          className={`text-[16px] text-dark lg:text-[20px] leading-[130%] hover:text-green focus-visible:text-green transition duration-300 ease-in-out ${
            selectedFilter === filter.value ? "text-green font-bold" : ""
          }`}
        >
          {filter.label}
        </a>
      ))}
    </div>
  );
}
