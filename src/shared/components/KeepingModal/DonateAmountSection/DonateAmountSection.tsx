"use client";

import React from "react";
import type { DonationTarget } from "@/features/donation/model/purpose";
import DonationAmountSectionBase from "@/shared/components/DonateModal/DonateAmountSection/DonateAmountSection";

const DonateAmountSection = ({
  price,
  donationTarget,
}: {
  price: number;
  donationTarget?: DonationTarget;
}) => {
  return <DonationAmountSectionBase price={price} donationTarget={donationTarget} />;
};

export default React.memo(DonateAmountSection);
