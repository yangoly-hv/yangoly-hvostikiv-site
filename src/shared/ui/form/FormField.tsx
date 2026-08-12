import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/shared/utils";

type FormFieldProps = PropsWithChildren<{
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  dense?: boolean;
}>;

export default function FormField({
  id,
  label,
  required = false,
  error,
  dense = false,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "block leading-[130%] text-dark",
          dense
            ? "mb-1 text-[15px] lg:text-[16px]"
            : "text-[16px] lg:text-[18px]",
        )}
      >
        {label}
        {required && <span className={cn(error && "text-red-500")}>*</span>}
      </label>
      {children}
      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          "transition-opacity duration-200",
          dense
            ? "min-h-[16px] text-xs leading-[16px]"
            : "min-h-[20px] text-sm leading-[20px]",
          error ? "text-red-500 opacity-100" : "opacity-0",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}
