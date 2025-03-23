"use client";
import { ICustomAmountCardProps } from "@/shared/types";
import React, { useCallback } from "react";

const CustomAmountCard = ({
  value,
  formatAmount,
  isSelected,
  onChange,
  onFocus,
  currency,
  anotherAmount,
}: ICustomAmountCardProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, "");
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <div
      className={`w-full py-4 px-[6px] min-w-[150px]  rounded-lg transition-all ${
        isSelected ? "border border-[#FF9332]" : "border border-gray-300"
      }`}
    >
      <input
        type="text"
        value={value ? `+${formatAmount(Number(value))} ${currency}` : ""}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={anotherAmount}
        className="w-full text-[16px] bg-transparent outline-none text-center"
      />
    </div>
  );
};

export default React.memo(CustomAmountCard);
