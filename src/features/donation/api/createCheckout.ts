import "client-only";

import { getWayforpayFormFields, isWayforpayCheckoutPayload } from "@/shared/lib/wayforpayForm";

import type { DonationSchedule, DonationTarget } from "../model/purpose";

export type CreateCheckoutParams = {
  amount: number;
  donationTarget?: DonationTarget;
  donationItemDescription?: string;
  fullName?: string;
  isAnonymous?: boolean;
  returnPath: string;
  comment?: string;
  isAgreed?: boolean;
  donationSchedule?: DonationSchedule;
  isRecurringAgreed?: boolean;
};

export async function createCheckout({
  amount,
  donationTarget,
  donationItemDescription,
  fullName,
  isAnonymous = false,
  returnPath,
  comment = "",
  isAgreed = false,
  donationSchedule = "oneTime",
  isRecurringAgreed = false,
}: CreateCheckoutParams) {
  const response = await fetch("/api/wayforpay/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      donationPurpose: donationTarget?.purpose,
      ...(donationTarget?.targetId ? { donationTargetId: donationTarget.targetId } : {}),
      ...(donationItemDescription ? { donationItemDescription } : {}),
      ...(isAnonymous ? { isAnonymous: true } : { isAnonymous: false, fullName }),
      comment,
      isAgreed,
      donationSchedule,
      isRecurringAgreed,
      returnPath,
    }),
  });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || !isWayforpayCheckoutPayload(data)) {
    throw new Error("CHECKOUT_CREATE_FAILED");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://secure.wayforpay.com/pay";
  form.acceptCharset = "utf-8";

  getWayforpayFormFields(data).forEach(({ name, value }) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
