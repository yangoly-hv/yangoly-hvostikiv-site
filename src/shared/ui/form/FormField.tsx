import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/shared/utils";

type FormFieldProps = PropsWithChildren<{
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
}>;

export default function FormField({
  id,
  label,
  required = false,
  error,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-[16px] leading-[130%] text-dark lg:text-[18px]">
        {label}
        {required && <span className={cn(error && "text-red-500")}>*</span>}
      </label>
      {children}
      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          "min-h-[20px] text-sm leading-[20px] transition-opacity duration-200",
          error ? "text-red-500 opacity-100" : "opacity-0",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}
