"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { IFilterOption, Locale } from "@/shared/types";

export default function Filter({ selectedFilter }: { selectedFilter: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("Filters");

  const lang = pathname.split("/")[1] as Locale;

  const filterOptions: IFilterOption[] = [
    { label: t("allTails"), value: "all" },
    // { label: t("needsSterilization"), value: "needs-sterilization" },
    { label: t("needsFamily"), value: "needs-family" },
    { label: t("adopted"), value: "adopted" },
  ];

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", value);
    params.set("page", "1");
    router.push(`/${lang}/tails?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-y-3 lg:gap-x-[44px] mb-10 lg:mb-[44px]">
      {filterOptions.map((filter) => (
        <button
          key={filter.value}
          className={`text-[16px] text-dark lg:text-[20px] leading-[130%] hover:text-green focus-visible:text-green transition duration-300 ease-in-out ${
            selectedFilter === filter.value ? "text-green font-bold" : ""
          }`}
          onClick={() => handleFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
