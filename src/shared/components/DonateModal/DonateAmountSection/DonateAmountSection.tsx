"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import CustomAmountCard from "../CustomAmountCard/CustomAmountCard";
import AmountCard from "../AmountCard/AmountCard";
import { formatAmount } from "@/shared/utils";

import DonationAmountForm from "@/features/donation/ui/DonationAmountForm";
import type { DonationTarget } from "@/features/donation/model/purpose";

const predefinedAmounts = [200, 500, 1000];

const DonateAmountSection = ({
  donationTarget,
  price,
  paymentButtonText,
}: {
  donationTarget?: DonationTarget;
  price?: number;
  paymentButtonText?: string;
}) => {
  const t = useTranslations("DonateModal");

  const translation = {
    title: t("donateAmountSection.title"),
    anotherAmount: t("donateAmountSection.anotherAmount"),
    fullNamePlaceholder: t("donateAmountSection.fullNamePlaceholder"),
    fullNameLabel: t("donateAmountSection.fullNameLabel"),
    anonymousLabel: t("donateAmountSection.anonymousLabel"),
    inputPlaceholder: t("donateAmountSection.inputPlaceholder"),
    inputLabel: t("donateAmountSection.inputLabel"),
    secondCheckboxLabel: t("donateAmountSection.secondCheckboxLabel"),
    currency: t("currency"),
  };

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  }, []);

  const handleCustomAmountChange = useCallback((value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  }, []);

  const handleCustomAmountFocus = useCallback(() => {
    setSelectedAmount(null);
  }, []);

  const parsedCustomAmount = Number(customAmount.replace(",", "."));
  const currentAmount = price ?? selectedAmount ?? (Number.isFinite(parsedCustomAmount) ? parsedCustomAmount : 0);
  const isFixedAmount = typeof price === "number";

  return (
      <DonationAmountForm
        amount={currentAmount}
        donationTarget={donationTarget}
        currency={translation.currency}
        title={translation.title}
        fullNamePlaceholder={translation.fullNamePlaceholder}
        fullNameLabel={translation.fullNameLabel}
        anonymousLabel={translation.anonymousLabel}
        inputPlaceholder={translation.inputPlaceholder}
        inputLabel={translation.inputLabel}
        agreementLabel={translation.secondCheckboxLabel}
        paymentButtonText={paymentButtonText}
        amountPicker={!isFixedAmount ?
          <div className="mx-auto grid max-w-[400px] grid-cols-3 gap-2 xl:max-w-[544px]">
            {predefinedAmounts.map((amount) => (
              <AmountCard
                key={amount}
                amount={amount}
                formattedAmount={formatAmount(amount)}
                currency={translation.currency}
                isSelected={selectedAmount === amount}
                onClick={handleAmountSelect}
              />
            ))}
            <div className="col-start-1">
              <CustomAmountCard
                anotherAmount={translation.anotherAmount}
                currency={translation.currency}
                value={customAmount}
                formatAmount={formatAmount}
                isSelected={selectedAmount === null && customAmount !== ""}
                onChange={handleCustomAmountChange}
                onFocus={handleCustomAmountFocus}
              />
            </div>
          </div>
        : undefined}
      />
  );
};

export default React.memo(DonateAmountSection);
