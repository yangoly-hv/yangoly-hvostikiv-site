import clsx from "clsx";
import { CircleArrowIcon } from "../../../../public/images/icons";
import { ISlidesPaginationProps } from "@/shared/types";

const SlidesPagination = ({
  direction,
  onClick,
  disabled = false,
  className = "",
}: ISlidesPaginationProps) => {
  const isPrev = direction === "prev";
  const buttonClass = `w-[50px] h-[50px] bg-[#34AD5D] flex justify-center items-center rounded-[16px]  ${
    isPrev ? "" : "rotate-180"
  } ${
    disabled
      ? " cursor-not-allowed !bg-[#FFF] shadow-[0px_12.777px_71.554px_2.555px_rgba(121,121,121,0.12)]"
      : "hover:bg-opacity-90"
  }`;

  return (
    <button
      className={clsx(buttonClass, className)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
    >
      <CircleArrowIcon color={clsx(disabled ? "#292D32" : "#FFFFFF")} />
    </button>
  );
};

export default SlidesPagination;
