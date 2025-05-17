"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TailCard from "@/shared/components/TailCard/TailCard";
import Filter from "@/modules/Filter/Filter";
import Pagination from "@/modules/Pagination/Pagination";
import { useItemsPerPage } from "@/shared/hooks/useItemsPerPage";
// import { tails } from "@/app/[locale]/tails/constans";
import { ITailsProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, generalSlideUp } from "@/shared/utils";

import {getTailData} from "@/shared/utils/functions";

// import {getAllAnimals} from "@/shared/api/animals";

//@ts-expect-error
export default function Tails({ data, translation, lang }) {
    // const [items, setItems] = useState([]);
    //@ts-expect-error
  const items = useMemo(() => data.map(item => getTailData(item, lang)), [data, getTailData]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const itemsPerPage = useItemsPerPage();

  useEffect(() => {
    setFilter(searchParams.get("filter") || "all");
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  const filteredTails =
    filter === "all"
      ? items
      //   @ts-expect-error
      : items.filter((tail) => tail.categories.includes(filter));

  const totalPages = Math.ceil(filteredTails.length / itemsPerPage);
  const currentItems = filteredTails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    setCurrentPage(page);
  };

  return (
    <section className=" mx-auto  container pt-[60px] lg:pt-8 pb-[100px] lg:pb-[148px] px-4 xl:px-10">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
      >
        <Filter selectedFilter={filter} />
      </motion.div>

      <div className="flex justify-center">
        <ul className="grid grid-cols-1 md:grid-cols-2 tabxl:grid-cols-3 laptop:grid-cols-4 gap-5 xl:gap-x-5 xl:gap-y-8 justify-items-center">
          {/*@ts-expect-error*/}
          {currentItems.map((tail, index) => (
            <motion.li
              key={index}
              variants={generalSlideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index * 0.2}
            >
              <TailCard tail={tail} translation={translation} />
            </motion.li>
          ))}
        </ul>
      </div>

        {totalPages > 1 && <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.8}
        className="flex justify-center mt-8 lg:mt-12"
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </motion.div>}
    </section>
  );
}
