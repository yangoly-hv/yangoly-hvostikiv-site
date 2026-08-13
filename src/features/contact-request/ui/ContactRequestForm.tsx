"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { UkraineFlag } from "../../../../public/images/icons";
import Button from "@/shared/components/Button/Button";
import FormField from "@/shared/ui/form/FormField";
import { formatUaPhoneMaskValue } from "@/shared/lib/uaPhone";
import { cn } from "@/shared/utils";
import type { ContactRequestCopy } from "../model/copy";
import {
  contactRequestSchema,
  type ContactRequestValues,
  type ContactValidationCode,
} from "../model/schema";

type ContactRequestFormProps = {
  copy: ContactRequestCopy;
  className?: string;
  onSubmit: (data: ContactRequestValues) => Promise<void>;
};

export default function ContactRequestForm({ copy, className, onSubmit }: ContactRequestFormProps) {
  const formId = useId();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequestValues>({
    defaultValues: { name: "", phone: "", message: "", website: "" },
    resolver: zodResolver(contactRequestSchema),
  });

  const applyPhoneValue = (raw: string) => {
    const formatted = formatUaPhoneMaskValue(raw);
    setValue("phone", formatted, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    return formatted;
  };

  const getErrorText = (field: keyof typeof errors) => {
    const code = errors[field]?.message as ContactValidationCode | undefined;
    return code ? copy.validation[code] ?? copy.errorText : undefined;
  };

  const inputClassName = (hasError: boolean, withIcon = false) =>
    cn(
      "w-full appearance-none rounded-md border bg-white px-[14px] py-3 text-[#1D1D1D] placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      withIcon && "pl-10",
      hasError && "border-red-500",
    );

  const nameId = `${formId}-name`;
  const phoneId = `${formId}-phone`;
  const messageId = `${formId}-message`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className={cn("relative space-y-1", className)}>
      <FormField id={nameId} label={copy.nameLabel} required error={getErrorText("name")}>
        <input
          id={nameId}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          placeholder={copy.namePlaceholder}
          className={inputClassName(Boolean(errors.name))}
          {...register("name")}
        />
      </FormField>

      <FormField id={phoneId} label={copy.phoneLabel} required error={getErrorText("phone")}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UkraineFlag />
          </div>
          <InputMask
            id={phoneId}
            aria-invalid={Boolean(errors.phone) || undefined}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            mask="+38 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            placeholder={copy.phonePlaceholder}
            className={inputClassName(Boolean(errors.phone), true)}
            autoComplete="tel-national"
            inputMode="numeric"
            {...register("phone")}
            onBlur={(event) => {
              applyPhoneValue(event.target.value);
            }}
            onChange={(event) => {
              const formatted = formatUaPhoneMaskValue(event.target.value);
              event.target.value = formatted;
              setValue("phone", formatted, { shouldDirty: true });
            }}
            onPaste={(event) => {
              const text = event.clipboardData.getData("text");
              if (!text) return;
              event.preventDefault();
              applyPhoneValue(text);
            }}
          />
        </div>
      </FormField>

      <FormField id={messageId} label={copy.messageLabel} error={getErrorText("message")}>
        <textarea
          id={messageId}
          rows={3}
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          placeholder={copy.messagePlaceholder}
          className={cn(inputClassName(Boolean(errors.message)), "resize-none")}
          {...register("message")}
        />
      </FormField>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Button
        className="w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        text={copy.submitText}
        type="submit"
      />
    </form>
  );
}
