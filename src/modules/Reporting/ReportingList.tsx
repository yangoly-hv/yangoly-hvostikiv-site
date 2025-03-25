"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// import Pagination from "../Pagination/Pagination";
import { ArrowDonwIcon } from "../../../public/images/icons";
// import { reportingList } from "@/app/[locale]/reporting/constants";
import { IReportingListProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, generalSlideUp } from "@/shared/utils";

//@ts-expect-error
export default function ReportingList({ data }: IReportingListProps) {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  // const handlePageChange = (page: number) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("page", page.toString());
  //   router.push(`?${params.toString()}`);
  //   setCurrentPage(page);
  // };

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <ul className="flex flex-col gap-y-6">
        {/*@ts-expect-error*/}
        {currentItems.map((item, idx) => (
          <motion.li
            key={idx}
            variants={generalSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={idx * 0.2}
            className="py-[22px] px-[26px] rounded-[32px] bg-white text-[20px] lg:text-[24px] leading-[120%]"
          >
            <Link
              href={`/reporting/${item?.documentId}`}
              className="group flex items-center justify-between w-full"
            >
              <motion.span
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.2 + 0.1}
                className="transition-colors duration-300 group-[focus-visible]:text-gray/60 xl:group-hover:text-gray/60"
              >
                {item?.date}
              </motion.span>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.2 + 0.2}
              >
                <ArrowDonwIcon className="rotate-[270deg] w-6 h-6 transition-colors duration-300 group-[focus-visible]:text-gray/60 xl:group-hover:text-gray/60" />
              </motion.div>
            </Link>
          </motion.li>
        ))}
      </ul>
      {/*<motion.div*/}
      {/*  variants={fadeIn}*/}
      {/*  initial="hidden"*/}
      {/*  whileInView="visible"*/}
      {/*  viewport={{ once: true }}*/}
      {/*  custom={0.8}*/}
      {/*  className="w-fit mt-8 lg:mt-12 mx-auto"*/}
      {/*>*/}
      {/*  <Pagination*/}
      {/*    currentPage={currentPage}*/}
      {/*    totalPages={totalPages}*/}
      {/*    onPageChange={handlePageChange}*/}
      {/*  />*/}
      {/*</motion.div>*/}
    </>
  );
}
