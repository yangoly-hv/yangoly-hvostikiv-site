"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { CheckboxIcon, UkraineFlag } from "../../../../public/images/icons";
import Button from "@/shared/components/Button/Button";
import FormField from "@/shared/ui/form/FormField";
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
    handleSubmit,
    watch,
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

  const selectedPetType = watch("petType");

  const getErrorText = (field: keyof typeof errors) => {
    const code = errors[field]?.message as EventRegistrationValidationCode | undefined;
    return code ? copy.validation[code] ?? copy.errorText : undefined;
  };

  const inputClassName = (hasError: boolean, withIcon = false) =>
    cn(
      "w-full appearance-none rounded-md border bg-white px-[14px] py-3 text-[#1D1D1D] placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
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
      className={cn("relative space-y-1", className)}
    >
      <FormField
        id={fullNameId}
        label={copy.fullNameLabel}
        required
        error={getErrorText("fullName")}
      >
        <input
          id={fullNameId}
          aria-invalid={Boolean(errors.fullName) || undefined}
          aria-describedby={errors.fullName ? `${fullNameId}-error` : undefined}
          placeholder={copy.fullNamePlaceholder}
          className={inputClassName(Boolean(errors.fullName))}
          autoComplete="name"
          {...register("fullName")}
        />
      </FormField>

      <FormField id={emailId} label={copy.emailLabel} required error={getErrorText("email")}>
        <input
          id={emailId}
          type="email"
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          placeholder={copy.emailPlaceholder}
          className={inputClassName(Boolean(errors.email))}
          autoComplete="email"
          {...register("email")}
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
            autoComplete="tel"
            {...register("phone")}
          />
        </div>
      </FormField>

      <fieldset className="min-w-0">
        <legend className="block text-[16px] leading-[130%] text-dark lg:text-[18px]">
          {copy.petTypeLabel}
          <span className={cn(petTypeError && "text-red-500")}>*</span>
        </legend>
        <div
          id={petTypeId}
          className="mt-2 flex flex-wrap gap-6"
          role="radiogroup"
          aria-invalid={Boolean(errors.petType) || undefined}
          aria-describedby={errors.petType ? `${petTypeId}-error` : undefined}
        >
          {PET_TYPE_OPTIONS.map((value) => {
            const optionId = `${petTypeId}-${value}`;
            const checked = selectedPetType === value;
            return (
              <label
                key={value}
                htmlFor={optionId}
                className="flex cursor-pointer items-center gap-2 text-[16px] text-[#1D1D1D] lg:text-[18px]"
              >
                <input
                  id={optionId}
                  type="radio"
                  value={value}
                  className="peer sr-only"
                  {...register("petType")}
                />
                <span className="rounded-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                  <CheckboxIcon
                    variant={
                      petTypeError ? "error" : checked ? "checked" : "default"
                    }
                  />
                </span>
                {petTypeLabels[value]}
              </label>
            );
          })}
        </div>
        <p
          id={`${petTypeId}-error`}
          aria-live="polite"
          className={cn(
            "min-h-[20px] text-sm leading-[20px] transition-opacity duration-200",
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
        error={getErrorText("petName")}
      >
        <input
          id={petNameId}
          aria-invalid={Boolean(errors.petName) || undefined}
          aria-describedby={errors.petName ? `${petNameId}-error` : undefined}
          placeholder={copy.petNamePlaceholder}
          className={inputClassName(Boolean(errors.petName))}
          {...register("petName")}
        />
      </FormField>

      <FormField
        id={commentsId}
        label={copy.commentsLabel}
        error={getErrorText("comments")}
      >
        <textarea
          id={commentsId}
          rows={3}
          aria-invalid={Boolean(errors.comments) || undefined}
          aria-describedby={errors.comments ? `${commentsId}-error` : undefined}
          placeholder={copy.commentsPlaceholder}
          className={cn(inputClassName(Boolean(errors.comments)), "resize-none")}
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
        className="w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        text={copy.submitText}
        type="submit"
      />
    </form>
  );
}
