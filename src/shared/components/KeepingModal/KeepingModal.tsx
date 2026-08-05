"use client";

import { useTranslations } from "next-intl";

import type { IKeepingModalProps } from "@/shared/types";
import PaymentModalShell from "@/shared/components/PaymentModal/PaymentModalShell";
import DonateAmountSection from "./DonateAmountSection/DonateAmountSection";

export default function KeepingModal({ isOpen, price = 0, donationTarget, onClose }: IKeepingModalProps) {
  const t = useTranslations("KeepingModal");

  return (
    <PaymentModalShell
      isOpen={isOpen}
      onClose={onClose}
      fundraisingTitle={t("fundraisingTitle")}
      goal={t("goal")}
      currency={t("currency")}
      subtitle={t("subtitle")}
    >
      <DonateAmountSection price={price} donationTarget={donationTarget} />
    </PaymentModalShell>
  );
}
