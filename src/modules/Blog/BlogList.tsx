import * as motion from "motion/react-client";

import type { BlogPostSummary } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import { getPageNumber } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import { fadeInAt, generalSlideUpAt } from "@/shared/utils";
import BlogCard from "./BlogCard";

type BlogListProps = {
  data: BlogPostSummary[];
  translation: IBlog;
  page?: string;
};

const ITEMS_PER_PAGE = 8;

export default function BlogList({ data, translation, page }: BlogListProps) {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentPage = getPageNumber(page, totalPages);
  const currentItems = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const getHref = (targetPage: number) => targetPage === 1 ? "/blog" : `/blog?page=${targetPage}`;

  return (
    <>
      {currentItems.length ? (
        <div className="flex justify-center">
          <ul className="grid grid-cols-1 md:grid-cols-2 tabxl:grid-cols-3 laptop:grid-cols-4 gap-5 xl:gap-x-5 xl:gap-y-8 justify-items-center">
            {currentItems.map((blogItem, index) => (
              <motion.li
                key={blogItem.id}
                variants={generalSlideUpAt(index * 0.2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
        <motion.div variants={fadeInAt(0.8)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-fit mt-8 lg:mt-12 mx-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} getHref={getHref} />
        </motion.div>
      )}
    </>
  );
}
