"use client";

import { useEffect, type ReactNode } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import CheckBox from "@/shared/components/CheckBox/CheckBox";
import PaymentButton from "@/shared/components/DonateModal/PaymentButton/PaymentButton";
import PublicOfferLink from "@/shared/components/PublicOfferLink/PublicOfferLink";
import TextInput from "@/shared/components/TextInput/TextInput";
import { formatAmount } from "@/shared/utils";
import type { DonationTarget } from "../model/purpose";
import { useDonationCheckout } from "../model/useDonationCheckout";

type DonationAmountFormProps = {
  amount: number;
  donationTarget?: DonationTarget;
  amountPicker?: ReactNode;
  currency: string;
  title: string;
  fullNamePlaceholder: string;
  fullNameLabel: string;
  anonymousLabel: string;
  inputPlaceholder: string;
  inputLabel: string;
  agreementLabel: string;
  paymentButtonText?: string;
};

export default function DonationAmountForm({
  amount,
  donationTarget,
  amountPicker,
  currency,
  title,
  fullNamePlaceholder,
  fullNameLabel,
  anonymousLabel,
  inputPlaceholder,
  inputLabel,
  agreementLabel,
  paymentButtonText,
}: DonationAmountFormProps) {
  const tCheckoutError = useTranslations("CheckoutError");
  const { control, formState, setValue, submit, submitError } = useDonationCheckout({
    initialAmount: amount,
    donationTarget,
    donationSchedule: donationTarget?.purpose === "tail-guardianship" ? "monthly" : "oneTime",
  });
  const isAgreed = useWatch({ control, name: "isAgreed" });
  const isAnonymous = useWatch({ control, name: "isAnonymous" });
  const currentAmount = useWatch({ control, name: "amount" });
  const donationSchedule = useWatch({ control, name: "donationSchedule" });
  const isRecurringAgreed = useWatch({ control, name: "isRecurringAgreed" });
  const isMonthly = donationSchedule === "monthly";

  useEffect(() => {
    setValue("amount", amount, { shouldValidate: true });
  }, [amount, setValue]);

  return (
    <form onSubmit={submit} className="relative flex flex-col items-center gap-4 py-4">
      <div className="w-full max-w-[350px] border border-[#FF9332] p-3 xl:max-w-[544px] xl:p-6">
        <p className="mb-2 text-center font-arial text-[20px] font-black uppercase leading-[130%] text-dark">
          {title}
        </p>
        <p className="mb-2 text-center text-[24px] leading-[130%] text-[#52525B] xl:text-[32px]">
          {formatAmount(currentAmount ?? 0)} {currency}
        </p>
        {amountPicker}
      </div>

      <div className="w-full max-w-[350px] xl:max-w-[544px]">
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextInput
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder={fullNamePlaceholder}
              label={fullNameLabel}
              disabled={isAnonymous}
            />
          )}
        />
        <Controller
          control={control}
          name="comment"
          render={({ field }) => (
            <TextInput
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder={inputPlaceholder}
              label={inputLabel}
            />
          )}
        />

        <div className="mb-4 space-y-3">
          <Controller
            control={control}
            name="isAnonymous"
            render={({ field }) => (
              <CheckBox
                label={anonymousLabel}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="isAgreed"
            render={({ field }) => (
              <CheckBox
                label={<PublicOfferLink text={agreementLabel} />}
                checked={field.value}
                onChange={field.onChange}
                error={Boolean(formState.errors.isAgreed)}
                required
              />
            )}
          />
          {isMonthly && (
            <Controller
              control={control}
              name="isRecurringAgreed"
              render={({ field }) => (
                <CheckBox
                  label={tCheckoutError("recurringAgreement", {
                    amount: formatAmount(currentAmount ?? 0),
                  })}
                  checked={field.value}
                  onChange={field.onChange}
                  error={Boolean(formState.errors.isRecurringAgreed)}
                  required
                />
              )}
            />
          )}
        </div>

        <div className="mb-2 space-y-2">
          <PaymentButton
              type="submit"
              disabled={
                formState.isSubmitting ||
              !isAgreed ||
              (isMonthly && !isRecurringAgreed) ||
              (currentAmount ?? 0) <= 0
            }
            paymentType="monoPay"
            text={paymentButtonText}
          />
        </div>
        {submitError && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {tCheckoutError("message")}
          </p>
        )}
      </div>
    </form>
  );
}
