"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary } from "@/shared/utils";
import { IFilterOption, Locale } from "@/shared/types";

export default function Filter({ selectedFilter }: { selectedFilter: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const lang = pathname.split("/")[1] as Locale;
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const { filters } = await getDictionary(lang);
        setFilterOptions([
          { label: filters.allTails, value: "all" },
          { label: filters.needsSterilization, value: "needs-sterilization" },
          { label: filters.needsFamily, value: "needs-family" },
          { label: filters.adopted, value: "adopted" },
        ]);
      } catch (error) {
        console.error("Error fetching filter translations:", error);
      }
    };

    fetchTranslations();
  }, [lang]);

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
