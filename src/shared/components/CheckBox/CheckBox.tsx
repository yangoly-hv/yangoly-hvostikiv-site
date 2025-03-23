"use client";
import { ICheckBoxProps } from "@/shared/types";
import React, { useCallback, useState } from "react";
import { CheckboxIcon } from "../../../../public/images/icons";

const CheckBox = ({ label, error, onChange, ...props }: ICheckBoxProps) => {
  const [checked, setChecked] = useState(props.checked || false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setChecked(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      <span>
        <CheckboxIcon
          variant={error ? "error" : checked ? "checked" : "default"}
        />
      </span>
      <span className="text-[18px] text-[#1D1D1D] leading-[133%]">{label}</span>
    </label>
  );
};

export default React.memo(CheckBox);
