"use client";
import { ITextInputProps } from "@/shared/types";
import React, { useCallback } from "react";

const TextInput = ({
  value,
  onChange,
  className = "",
  label,
  ...props
}: ITextInputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="w-full mb-6">
      {label && (
        <label className="block text-[18px] text-[#1D1D1D] mb-2 leading-[133%]">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`w-full pl-[12px] py-[11px] border text-[14px] xl:text-[16px] bg-white text-dark border-[#A1A1AA] rounded-[4px] focus:outline-none focus:border-orange-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default React.memo(TextInput);
