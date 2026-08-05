import clsx from "clsx";

import SlidesPagination from "@/shared/ui/SlidesPagination";

type SliderNavigationControlsProps = {
  className?: string;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function SliderNavigationControls({
  className,
  isPrevDisabled,
  isNextDisabled,
  onPrevious,
  onNext,
}: SliderNavigationControlsProps) {
  return (
    <div
      className={clsx(
        "flex justify-center gap-6",
        isPrevDisabled && isNextDisabled && "hidden",
        className,
      )}
    >
      <SlidesPagination
        className="bg-orange"
        direction="prev"
        onClick={onPrevious}
        disabled={isPrevDisabled}
      />
      <SlidesPagination
        className="bg-orange"
        direction="next"
        onClick={onNext}
        disabled={isNextDisabled}
      />
    </div>
  );
}
