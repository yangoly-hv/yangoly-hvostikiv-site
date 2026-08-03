"use client";

import type { IFundraisingGoalProps } from "@/shared/types";
import { cn } from "@/shared/utils";

const FundraisingGoal = ({
  fundraisingTitle,
  subtitle,
  styles,
  ...props
}: IFundraisingGoalProps) => (
  <div className="px-4" {...props}>
    <h2 className={cn("text-orange text-[16px] leading-[130%] text-center mt-[8px] xl:text-[24px]", styles?.titleClassName)}>
      {fundraisingTitle}
    </h2>
    {subtitle && (
      <p className="text-orange text-[24px] max-w-[325px] mx-auto text-center mt-2">
        {subtitle}
      </p>
    )}
  </div>
);

export default FundraisingGoal;
