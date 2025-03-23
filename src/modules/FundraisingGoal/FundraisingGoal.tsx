"use client";
import ProgressBar from "@/shared/components/ProgressBar/ProgressBar";
import { IFundraisingGoalProps } from "@/shared/types";
import { cn, formatAmount } from "@/shared/utils";
import JarWithPaw from "./JarWithPaw/JarWithPaw";

const FundraisingGoal = ({
  fundraisingTitle,
  subtitle,
  goal,
  currency,
  totalAmount,
  currentAmount,
  styles,
  imageVariant,
  ...props
}: IFundraisingGoalProps) => {
  return (
    <div className="px-4" {...props}>
      <h2
        className={cn(
          "text-orange text-[16px]  leading-[130%] text-center mt-[8px] xl:text-[24px]",
          styles?.titleClassName
        )}
      >
        {fundraisingTitle}
      </h2>
      {subtitle && (
        <p className="text-orange text-[24px] mx-auto text-center mt-2">
          {subtitle}
        </p>
      )}

      <div className="relative flex justify-center mt-4 mb-3">
        <JarWithPaw variant={imageVariant} />
      </div>

      <div className="w-full max-w-[300px] xl:max-w-[383px] mx-auto">
        <div className="flex justify-between text-sm mb-2">
          <span
            className={cn(
              "text-black text-[16px] font-semibold leading-[24px]",
              styles?.goalClassName
            )}
          >
            {goal}
          </span>
          <span className="text-white px-[21px] py-[5px] no-ligatures text-[16px]  bg-orange font-bold rounded-[32px]">
            {formatAmount(totalAmount)} {currency}
          </span>
        </div>

        <ProgressBar totalAmount={totalAmount} currentAmount={currentAmount} />

        <div className="mt-2">
          <span
            className={cn(
              "text-[14px] leading-[170%] no-ligatures  font-normal text-black",
              styles?.currentAmountClassName
            )}
          >
            {formatAmount(currentAmount)} {currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundraisingGoal;
