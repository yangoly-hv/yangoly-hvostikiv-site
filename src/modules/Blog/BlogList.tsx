"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";

import type { BlogPostSummary } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import { getPageNumber } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import { fadeIn, generalSlideUp } from "@/shared/utils";
import BlogCard from "./BlogCard";

type BlogListProps = {
  data: BlogPostSummary[];
  translation: IBlog;
};

const ITEMS_PER_PAGE = 8;

export default function BlogList({ data, translation }: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentPage = getPageNumber(searchParams.get("page"), totalPages);
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {currentItems.length ? (
        <div className="flex justify-center">
          <ul className="grid grid-cols-1 md:grid-cols-2 tabxl:grid-cols-3 laptop:grid-cols-4 gap-5 xl:gap-x-5 xl:gap-y-8 justify-items-center">
            {currentItems.map((blogItem, index) => (
              <motion.li
                key={blogItem.id}
                variants={generalSlideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.2}
              >
                <BlogCard blogItem={blogItem} translation={translation} />
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="py-12 text-center text-dark">No publications yet</p>
      )}
      {totalPages > 1 && (
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8} className="w-fit mt-8 lg:mt-12 mx-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </motion.div>
      )}
    </>
  );
}
