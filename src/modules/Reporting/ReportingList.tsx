import * as motion from "motion/react-client";

import { Link } from "@/i18n/navigation";
import { getPageNumber } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import { fadeInAt, generalSlideUpAt } from "@/shared/utils";
import { ArrowDonwIcon } from "../../../public/images/icons";

export type ReportingListItem = {
  _id: string;
  slug: string;
  date: string;
};

const ITEMS_PER_PAGE = 12;

export default function ReportingList({
  data,
  page,
}: {
  data: ReportingListItem[];
  page?: string;
}) {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentPage = getPageNumber(page, totalPages);
  const currentItems = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const getHref = (targetPage: number) => targetPage === 1 ? "/reporting" : `/reporting?page=${targetPage}`;

  return (
    <>
      {currentItems.length ? (
        <ul className="flex flex-col gap-y-6">
          {currentItems.map((item, index) => (
            <motion.li key={item._id} variants={generalSlideUpAt(index * 0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-[22px] px-[26px] rounded-[32px] bg-white text-[20px] lg:text-[24px] leading-[120%]">
              <Link href={`/reporting/${item.slug}`} className="group flex items-center justify-between w-full">
                <motion.span variants={fadeInAt(index * 0.2 + 0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="transition-colors duration-300 group-[focus-visible]:text-gray/60 xl:group-hover:text-gray/60">
                  {item.date}
                </motion.span>
                <motion.div variants={fadeInAt(index * 0.2 + 0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <ArrowDonwIcon className="rotate-270 w-6 h-6 transition-colors duration-300 group-[focus-visible]:text-primary-gray xl:group-hover:text-primary-gray" />
                </motion.div>
              </Link>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="py-12 text-center text-dark">No reports yet</p>
      )}
      {totalPages > 1 && (
        <motion.div variants={fadeInAt(0.8)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-fit mt-8 lg:mt-12 mx-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} getHref={getHref} />
        </motion.div>
      )}
    </>
  );
}
