"use client";

import { useTranslations } from "next-intl";

import type { IDonateModalProps } from "@/shared/types";
import PaymentModalShell from "@/shared/components/PaymentModal/PaymentModalShell";
import DonateAmountSection from "./DonateAmountSection/DonateAmountSection";

export default function DonateModal({ title, donationTarget, isOpen, onClose }: IDonateModalProps) {
  const t = useTranslations("DonateModal");

  return (
    <PaymentModalShell
      isOpen={isOpen}
      onClose={onClose}
      fundraisingTitle={title}
      goal={t("goal")}
      currency={t("currency")}
      subtitle={t("subtitle")}
      showFundraisingPanel
      progress={donationTarget?.purpose === "collection" && typeof donationTarget.amount === "number" && typeof donationTarget.amountCollected === "number"
        ? { totalAmount: donationTarget.amount, currentAmount: donationTarget.amountCollected }
        : undefined}
    >
      <DonateAmountSection
        donationTarget={donationTarget}
        paymentButtonText={t("donateAmountSection.donate")}
      />
    </PaymentModalShell>
  );
}
