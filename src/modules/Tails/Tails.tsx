"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";

import Filter from "@/modules/Filter/Filter";
import type { TailViewModel } from "@/features/tails/model/types";
import TailCard from "@/features/tails/ui/TailCard";
import type { ITails } from "@/shared/types";
import { getPageNumber } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import { fadeIn, generalSlideUp } from "@/shared/utils";

type TailsProps = {
  data: TailViewModel[];
  translation: ITails;
  lang: "uk" | "en";
};

const ITEMS_PER_PAGE = 8;

export default function Tails({ data, translation, lang }: TailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const filteredTails =
    filter === "all"
      ? data
      : data.filter((tail) => tail.categories.includes(filter));
  const totalPages = Math.ceil(filteredTails.length / ITEMS_PER_PAGE);
  const currentPage = getPageNumber(searchParams.get("page"), totalPages);
  const currentItems = filteredTails.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="mx-auto container pt-[60px] lg:pt-8 pb-[100px] lg:pb-[148px] px-4 xl:px-10">
      <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <Filter selectedFilter={filter} />
      </motion.div>

      {currentItems.length ? (
        <div className="flex justify-center">
          <ul className="flex flex-wrap gap-5 xl:gap-x-5 xl:gap-y-8 w-full">
            {currentItems.map((tail, index) => (
              <motion.li
                key={tail.id}
                variants={generalSlideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.2}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33%-13.33px)] laptop:w-[calc(25%-15px)]"
              >
                <TailCard tail={tail} translation={translation} />
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="py-12 text-center text-dark">
          {lang === "uk" ? "Нічого не знайдено" : "Nothing found"}
        </p>
      )}

      {totalPages > 1 && (
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8} className="flex justify-center mt-8 lg:mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </motion.div>
      )}
    </section>
  );
}
