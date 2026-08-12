"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";

import { UkraineFlag } from "../../../../public/images/icons";
import Button from "@/shared/components/Button/Button";
import CheckBox from "@/shared/components/CheckBox/CheckBox";
import FormField from "@/shared/ui/form/FormField";
import { formatUaPhoneMaskValue } from "@/shared/lib/uaPhone";
import { cn } from "@/shared/utils";
import type { EventRegistrationCopy } from "../model/copy";
import {
  eventRegistrationFormSchema,
  type EventPetType,
  type EventRegistrationFormValues,
  type EventRegistrationValidationCode,
} from "../model/schema";

type EventRegistrationFormProps = {
  copy: EventRegistrationCopy;
  className?: string;
  onSubmit: (data: EventRegistrationFormValues) => Promise<void>;
};

const PET_TYPE_OPTIONS: EventPetType[] = ["dog", "cat"];

export default function EventRegistrationForm({
  copy,
  className,
  onSubmit,
}: EventRegistrationFormProps) {
  const formId = useId();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      petType: undefined,
      petName: "",
      comments: "",
      website: "",
    },
    resolver: zodResolver(eventRegistrationFormSchema),
  });

  const phoneField = register("phone");

  const applyPhoneValue = (raw: string, options?: { shouldValidate?: boolean }) => {
    const formatted = formatUaPhoneMaskValue(raw);
    setValue("phone", formatted, {
      shouldDirty: true,
      shouldValidate: options?.shouldValidate ?? true,
    });
    return formatted;
  };

  const getErrorText = (field: keyof typeof errors) => {
    const code = errors[field]?.message as EventRegistrationValidationCode | undefined;
    return code ? copy.validation[code] ?? copy.errorText : undefined;
  };

  const inputClassName = (hasError: boolean, withIcon = false) =>
    cn(
      "w-full appearance-none rounded-md border bg-white px-3 py-2.5 text-[15px] text-[#1D1D1D] placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 md:text-[16px]",
      withIcon && "pl-10",
      hasError && "border-red-500",
    );

  const fullNameId = `${formId}-fullName`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const petTypeId = `${formId}-petType`;
  const petNameId = `${formId}-petName`;
  const commentsId = `${formId}-comments`;
  const petTypeError = getErrorText("petType");
  const petTypeLabels: Record<EventPetType, string> = {
    dog: copy.petTypeDog,
    cat: copy.petTypeCat,
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={isSubmitting}
      className={cn("relative space-y-0.5", className)}
    >
      <FormField
        id={fullNameId}
        label={copy.fullNameLabel}
        required
        dense
        error={getErrorText("fullName")}
      >
        <input
          id={fullNameId}
          aria-invalid={Boolean(errors.fullName) || undefined}
          aria-describedby={errors.fullName ? `${fullNameId}-error` : undefined}
          placeholder={copy.fullNamePlaceholder}
          className={inputClassName(Boolean(errors.fullName))}
          autoComplete="name"
          suppressHydrationWarning
          {...register("fullName")}
        />
      </FormField>

      <FormField
        id={emailId}
        label={copy.emailLabel}
        required
        dense
        error={getErrorText("email")}
      >
        {/* Wrapper absorbs autofill/extension DOM injections (password managers, wallets). */}
        <div suppressHydrationWarning>
          <input
            id={emailId}
            type="email"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            placeholder={copy.emailPlaceholder}
            className={inputClassName(Boolean(errors.email))}
            autoComplete="email"
            suppressHydrationWarning
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField
        id={phoneId}
        label={copy.phoneLabel}
        required
        dense
        error={getErrorText("phone")}
      >
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
            suppressHydrationWarning
            name={phoneField.name}
            ref={phoneField.ref}
            onBlur={(event) => {
              applyPhoneValue(event.target.value, { shouldValidate: true });
              phoneField.onBlur(event);
            }}
            onChange={(event) => {
              const formatted = formatUaPhoneMaskValue(event.target.value);
              event.target.value = formatted;
              phoneField.onChange(event);
            }}
            onPaste={(event) => {
              const text = event.clipboardData.getData("text");
              if (!text) return;
              event.preventDefault();
              applyPhoneValue(text, { shouldValidate: true });
            }}
          />
        </div>
      </FormField>

      <fieldset className="min-w-0">
        <legend className="mb-1 block text-[15px] leading-[130%] text-dark lg:text-[16px]">
          {copy.petTypeLabel}
          <span className={cn(petTypeError && "text-red-500")}>*</span>
        </legend>
        <Controller
          name="petType"
          control={control}
          render={({ field }) => (
            <div
              id={petTypeId}
              className="flex flex-row flex-wrap gap-x-5 gap-y-2"
              role="radiogroup"
              aria-invalid={Boolean(errors.petType) || undefined}
              aria-describedby={errors.petType ? `${petTypeId}-error` : undefined}
            >
              {PET_TYPE_OPTIONS.map((value) => (
                <CheckBox
                  key={value}
                  name={`petType-${value}`}
                  label={petTypeLabels[value]}
                  checked={field.value === value}
                  error={Boolean(petTypeError)}
                  onChange={(checked) => {
                    if (checked) {
                      field.onChange(value);
                    }
                  }}
                />
              ))}
            </div>
          )}
        />
        <p
          id={`${petTypeId}-error`}
          aria-live="polite"
          className={cn(
            "min-h-[16px] text-xs leading-[16px] transition-opacity duration-200",
            petTypeError ? "text-red-500 opacity-100" : "opacity-0",
          )}
        >
          {petTypeError ?? ""}
        </p>
      </fieldset>

      <FormField
        id={petNameId}
        label={copy.petNameLabel}
        required
        dense
        error={getErrorText("petName")}
      >
        <input
          id={petNameId}
          aria-invalid={Boolean(errors.petName) || undefined}
          aria-describedby={errors.petName ? `${petNameId}-error` : undefined}
          placeholder={copy.petNamePlaceholder}
          className={inputClassName(Boolean(errors.petName))}
          suppressHydrationWarning
          {...register("petName")}
        />
      </FormField>

      <FormField
        id={commentsId}
        label={copy.commentsLabel}
        dense
        error={getErrorText("comments")}
      >
        <textarea
          id={commentsId}
          rows={2}
          aria-invalid={Boolean(errors.comments) || undefined}
          aria-describedby={errors.comments ? `${commentsId}-error` : undefined}
          placeholder={copy.commentsPlaceholder}
          className={cn(inputClassName(Boolean(errors.comments)), "resize-none")}
          suppressHydrationWarning
          {...register("comments")}
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
        className="mt-2 w-full py-2.5 disabled:cursor-not-allowed disabled:opacity-60 md:mt-3"
        disabled={isSubmitting}
        text={copy.submitText}
        type="submit"
      />
    </form>
  );
}
