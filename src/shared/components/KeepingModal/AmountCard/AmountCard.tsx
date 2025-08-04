"use client";
import { IAmountCardProps } from "@/shared/types";
import React, { useCallback } from "react";

const AmountCard = ({
  amount,
  formattedAmount,
  isSelected,
  onClick,
  currency,
}: IAmountCardProps) => {
  const handleClick = useCallback(() => {
    onClick(amount);
  }, [onClick, amount]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full py-4 leading-[130%] px-1 text-[16px] text-dark  rounded-lg transition-all ${
        isSelected
          ? "border border-[#FF9332]"
          : "border border-gray-300 hover:border-orange-500 hover:bg-orange-50"
      }`}
    >
      +{formattedAmount} {currency}
    </button>
  );
};

export default React.memo(AmountCard);
