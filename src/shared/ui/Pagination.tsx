import ArrowInCircleIcon from "../../../public/images/icons/ArrowInCircleIcon";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  getHref: (page: number) => string;
};

export default function Pagination({
  currentPage,
  totalPages,
  maxVisiblePages = 4,
  getHref,
}: PaginationProps) {
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  startPage = Math.max(1, endPage - maxVisiblePages + 1);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index
  );

  return (
    <nav aria-label="Pagination" className="inline-flex justify-center items-center gap-[35px]">
      {currentPage === 1 ? (
        <span aria-disabled="true" className="flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination bg-white text-gray-400">
          <ArrowInCircleIcon className="rotate-180" />
        </span>
      ) : (
        <a href={getHref(currentPage - 1)} aria-label="Previous page" className="flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination bg-orange transition duration-300 ease-in-out hover:brightness-115 active:scale-95 focus-visible:brightness-115">
          <ArrowInCircleIcon className="rotate-180" />
        </a>
      )}

      <div>
        {pageNumbers.map((page) => (
          page === currentPage ? (
            <span aria-current="page" aria-label={`Page ${page}`} key={page} className="px-[9px] py-2 text-[20px] font-medium leading-[16px] text-orange">
              {page}
            </span>
          ) : (
            <a href={getHref(page)} aria-label={`Page ${page}`} key={page} className="px-[9px] py-2 text-[20px] font-medium leading-[16px] transition duration-300 ease-in-out hover:text-orange">
              {page}
            </a>
          )
        ))}
      </div>

      {currentPage === totalPages ? (
        <span aria-disabled="true" className="flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination text-gray-400 bg-white">
          <ArrowInCircleIcon />
        </span>
      ) : (
        <a href={getHref(currentPage + 1)} aria-label="Next page" className="flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination bg-orange transition duration-300 ease-in-out hover:brightness-115 active:scale-95 focus-visible:brightness-115">
          <ArrowInCircleIcon />
        </a>
      )}
    </nav>
  );
}
