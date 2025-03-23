import { IProgressBarProps } from "@/shared/types";

const ProgressBar = ({
  totalAmount,
  currentAmount,
  height = "12px",
  className,
  ...rest
}: IProgressBarProps) => {
  const progress = (currentAmount / totalAmount) * 100;

  return (
    <div className={`w-full  mx-auto ${className}`} {...rest}>
      <div
        className={`relative bg-[#EAECED] rounded-full overflow-hidden `}
        style={{ height }}
      >
        <div
          className="absolute left-0 top-0 bg-orange rounded-full"
          style={{ width: `${progress}%`, height }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
