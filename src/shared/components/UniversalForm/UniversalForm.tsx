"use client";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputMask } from "@react-input/mask";
import { cn } from "@/shared/utils";
import { IFormConfig, IFormField } from "@/shared/types";
import Button from "../Button/Button";

export const UniversalForm = <TFieldName extends string>({
  title,
  fields,
  submitText,
  onSubmit,
  className,
}: IFormConfig<TFieldName>) => {
  const pickFormValues = (
    data: Record<string, string | undefined>,
  ): Record<TFieldName, string> =>
    Object.fromEntries(
      fields.map((field) => [field.name, data[field.name] ?? ""]),
    ) as Record<TFieldName, string>;
  const validationSchema = yup.object().shape(
    fields.reduce<Record<string, yup.StringSchema>>(
      (acc, field) => ({
        ...acc,
        [field.name]: field.validation || yup.string(),
      }),
      {}
    )
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string | undefined>>({
    resolver: yupResolver(validationSchema),
  });

  const renderField = (field: IFormField<TFieldName>) => {
    const commonProps = {
      ...register(field.name),
      placeholder: field.placeholder,
      className: cn(
        "w-full rounded-md border px-[14px] py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-[#1D1D1D] placeholder:text-gray-500",
        field.icon && "pl-10",
        errors[field.name] && "border-red-500"
      ),
    };

    if (field.type === "textarea") {
      return (
        <textarea
          {...commonProps}
          className={cn(commonProps.className, "resize-none")}
          rows={3}
        />
      );
    }

    if (field.type === "tel" && field.mask) {
      return (
        <InputMask
          mask={field.mask}
          replacement={{ _: /\d/ }}
          {...commonProps}
        />
      );
    }

    return <input type={field.type} {...commonProps} />;
  };

  return (
    <div
      className={cn(
        "w-full  mx-auto p-6 bg-white rounded-lg shadow-sm",
        className
      )}
    >
      {title && (
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
      )}

      <form
        onSubmit={handleSubmit(async (data) => {
          if (onSubmit) await onSubmit(pickFormValues(data));
        })}
        aria-busy={isSubmitting}
        className="space-y-1"
      >
        {fields.map((field) => (
          <div key={field.name} className="">
            <label className="block text-[16px] lg:text-[18px] leading-[130%] text-dark">
              {field.label}
              {field.required && (
                <span className={cn("", errors[field.name] && "text-red-500")}>
                  *
                </span>
              )}
            </label>

            <div className="relative">
              {field.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {field.icon}
                </div>
              )}
              {renderField(field)}
            </div>

            <p
              className={cn(
                "text-sm leading-[20px] transition-opacity duration-200",
                errors[field.name] ? "text-red-500 opacity-100" : "opacity-0"
              )}
            >
              {String(errors[field.name]?.message || " ")}
            </p>
          </div>
        ))}

        <Button
          className="w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          text={submitText}
          type="submit"
        />
      </form>
    </div>
  );
};

export default UniversalForm;
