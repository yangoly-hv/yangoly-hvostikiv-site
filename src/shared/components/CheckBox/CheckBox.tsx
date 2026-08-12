"use client";
import { ICheckBoxProps } from "@/shared/types";
import React, { useCallback, useId } from "react";
import { CheckboxIcon } from "../../../../public/images/icons";

const CheckBox = ({ label, error, onChange, checked = false, ...props }: ICheckBoxProps) => {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        aria-invalid={error || undefined}
        className="peer sr-only"
        {...props}
      />
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
        <CheckboxIcon
          variant={error ? "error" : checked ? "checked" : "default"}
        />
      </span>
      <span className="text-[18px] text-[#1D1D1D] leading-[133%]">{label}</span>
    </label>
  );
};

export default React.memo(CheckBox);
