"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "../Pagination/Pagination";
import BlogCard from "./BlogCard";
import { useItemsPerPage } from "@/shared/hooks/useItemsPerPage";
// import { IBlogListProps } from "@/shared/types";
// import { newsList } from "@/app/[locale]/blog/constants";
import { motion } from "framer-motion";
import { fadeIn, generalSlideUp } from "@/shared/utils";

// import {getAllBlogItems} from "@/shared/api/blog";

import {getBlogItemData} from "@/shared/utils/functions";

//@ts-expect-error
export default function BlogList({ data, translation }) {
  // const [items, setItems] = useState([]);
  const items = data.map(getBlogItemData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // useEffect(() => {
  //   const fetchItems = async()=> {
  //     try {
  //       const data = await getAllBlogItems(lang);
  //       const transformData = data.map(getBlogItemData);
  //       setItems(transformData);
  //     }
  //     catch(error) {
  //       console.log(error)
  //     }
  //   }
  //
  //   fetchItems();
  // }, []);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    setCurrentPage(page);
  };

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex justify-center">
        <ul className="grid grid-cols-1 md:grid-cols-2 tabxl:grid-cols-3 laptop:grid-cols-4 gap-5 xl:gap-x-5 xl:gap-y-8 justify-items-center">
          {/*@ts-expect-error*/}
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
      {totalPages > 1 && <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.8}
        className="w-fit mt-8 lg:mt-12 mx-auto"
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </motion.div>}
    </>
  );
}
