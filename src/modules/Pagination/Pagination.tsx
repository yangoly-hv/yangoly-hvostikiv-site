import ArrowInCircleIcon from "../../../public/images/icons/ArrowInCircleIcon";

export default function Pagination({
  currentPage,
  totalPages,
  maxVisiblePages = 4,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
}) {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="inline-flex justify-center items-center gap-[35px]">
      <button
        className={`flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination transition duration-300 ease-in-out
          enabled:hover:brightness-[115%] enabled:active:scale-95 enabled:focus-visible:brightness-[115%]
          ${currentPage === 1 ? "bg-white text-gray-400" : "bg-orange"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowInCircleIcon className="rotate-180" />
      </button>

      <div>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`px-[9px] py-2 text-[20px] font-medium leading-[16px] transition duration-300 ease-in-out
            ${
              page === currentPage
                ? "hover:bg-opacity-80 text-orange"
                : "  hover:text-orange"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`flex justify-center items-center p-[13px] lg:p-[16.5px] size-[52px] lg:size-[66px] rounded-[19.8px] shadow-pagination transition duration-300 ease-in-out
           enabled:hover:brightness-[115%] enabled:active:scale-95 enabled:focus-visible:brightness-[115%] 
          ${
            currentPage === totalPages ? "text-gray-400 bg-white" : "bg-orange"
          }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowInCircleIcon />
      </button>
    </div>
  );
}
