"use client";

import { useTranslations } from "next-intl";

import type { IDonateModalProps } from "@/shared/types";
import PaymentModalShell from "@/shared/components/PaymentModal/PaymentModalShell";
import DonateAmountSection from "./DonateAmountSection/DonateAmountSection";

export default function DonateModal({ title, donationTarget, isOpen, onClose }: IDonateModalProps) {
  const t = useTranslations("DonateModal");
  const isTailOneTime = donationTarget?.purpose === "tail-one-time";
  const fundraisingTitle =
    title ||
    (isTailOneTime ? t("tailOneTimeTitle") : t("fundraisingOneTimeTitle"));
  const subtitle = isTailOneTime ? t("tailSubtitle") : t("subtitle");

  return (
    <PaymentModalShell
      isOpen={isOpen}
      onClose={onClose}
      fundraisingTitle={fundraisingTitle}
      goal={t("goal")}
      currency={t("currency")}
      subtitle={subtitle}
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
