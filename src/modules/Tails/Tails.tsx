"use client";

import * as motion from "motion/react-client";

import Filter from "@/modules/Filter/Filter";
import type { TailViewModel } from "@/features/tails/model/types";
import TailCard from "@/features/tails/ui/TailCard";
import type { ITails } from "@/shared/types";
import { getPageNumber } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import type { IFilterOption } from "@/shared/types";
import { fadeIn, generalSlideUp } from "@/shared/utils";

type TailsProps = {
  data: TailViewModel[];
  translation: ITails;
  lang: "uk" | "en";
  filter: string;
  page?: string;
  filterOptions: IFilterOption[];
};

const ITEMS_PER_PAGE = 8;

export default function Tails({ data, translation, lang, filter, page, filterOptions }: TailsProps) {
  const filteredTails =
    filter === "all"
      ? data
      : data.filter((tail) => tail.categories.includes(filter));
  const totalPages = Math.ceil(filteredTails.length / ITEMS_PER_PAGE);
  const currentPage = getPageNumber(page, totalPages);
  const currentItems = filteredTails.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const getHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `?${query}` : "?";
  };

  return (
    <section className="mx-auto container pt-[60px] lg:pt-8 pb-[100px] lg:pb-[148px] px-4 xl:px-10">
      <h1 className="sr-only">{translation.allTails}</h1>
      <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <Filter selectedFilter={filter} options={filterOptions} />
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
          <Pagination currentPage={currentPage} totalPages={totalPages} getHref={getHref} />
        </motion.div>
      )}
    </section>
  );
}
