import "server-only";

import { Resend } from "resend";

import { getPaymentsClient } from "@/shared/lib/sanity.payments";

import type { DonationPurpose } from "../model/purpose";

export type DonationEmailStatus = "pending" | "sent";

export type DonationEmailOrder = {
  _id: string;
  orderReference: string;
  occurrenceId: string;
  amountMinor: number;
  currency: string;
  donationPurpose: DonationPurpose;
  donationTargetName: string;
  donationItemDescription?: string;
  donorFullName?: string;
  isAnonymous?: boolean;
  comment?: string;
  donationEmailEnabled?: boolean;
  donationEmailStatus?: DonationEmailStatus;
  providerTransactionStatus?: string;
  lastProviderProcessingAt?: string;
};

export type DonationEmail = {
  subject: string;
  html: string;
  text: string;
};

const defaultFrom = 'Благодійний фонд "Янголи хвостиків" <no-reply@angelsua.org>';
const defaultTo = "angelsuaorg@gmail.com";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );

const formatAmount = (amountMinor: number, currency: string) => {
  const amount = amountMinor / 100;
  const currencyLabel = currency === "UAH" ? "грн" : currency;
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)} ${currencyLabel}`;
};

export const getDonationPurposeLabel = (
  purpose: DonationPurpose,
  targetName: string,
) => {
  switch (purpose) {
    case "collection":
      return `Пожертва на збір: ${targetName}`;
    case "tail-one-time":
      return `Разова допомога хвостику: ${targetName}`;
    case "tail-guardianship":
      return `Опіка хвостика: ${targetName}`;
    case "foundation":
      return "Підтримка роботи фонду";
  }
};

export const createDonationEmail = (order: DonationEmailOrder): DonationEmail => {
  const purpose = getDonationPurposeLabel(order.donationPurpose, order.donationTargetName);
  const itemDescription = order.donationItemDescription?.trim();
  const amount = formatAmount(order.amountMinor, order.currency);
  const donor = order.isAnonymous === true || !order.donorFullName?.trim()
    ? "Анонімно"
    : order.donorFullName.trim();
  const comment = order.comment?.trim() || "—";
  const providerStatus = order.providerTransactionStatus || "Approved";
  const confirmedAt = order.lastProviderProcessingAt || "—";

  return {
    subject: `Підтверджене пожертвування — ${purpose} — ${amount}`,
    html: `
      <p><b>Тип пожертвування:</b> ${escapeHtml(purpose)}</p>
      <p><b>Призначення:</b> ${escapeHtml(order.donationTargetName)}</p>
      ${itemDescription ? `<p><b>Обрана допомога:</b> ${escapeHtml(itemDescription)}</p>` : ""}
      <p><b>Сума:</b> ${escapeHtml(amount)}</p>
      <p><b>Донор:</b> ${escapeHtml(donor)}</p>
      <p><b>Коментар:</b><br/>${escapeHtml(comment).replace(/\r?\n/g, "<br/>")}</p>
      <p><b>WayForPay order reference:</b> ${escapeHtml(order.orderReference)}</p>
      <p><b>Статус WayForPay:</b> ${escapeHtml(providerStatus)}</p>
      <p><b>Час підтвердження:</b> ${escapeHtml(confirmedAt)}</p>
    `,
    text: [
      `Тип пожертвування: ${purpose}`,
      `Призначення: ${order.donationTargetName}`,
      ...(itemDescription ? [`Обрана допомога: ${itemDescription}`] : []),
      `Сума: ${amount}`,
      `Донор: ${donor}`,
      `Коментар: ${comment}`,
      `WayForPay order reference: ${order.orderReference}`,
      `Статус WayForPay: ${providerStatus}`,
      `Час підтвердження: ${confirmedAt}`,
    ].join("\n"),
  };
};

const patchDelivery = async (
  orderId: string,
  update: Record<string, unknown>,
) =>
  getPaymentsClient()
    .patch(orderId)
    .set(update)
    .inc({ donationEmailAttemptCount: 1 })
    .commit();

export const deliverDonationEmail = async (order: DonationEmailOrder) => {
  if (
    order.donationEmailEnabled !== true ||
    order.donationEmailStatus === "sent"
  ) {
    return "skipped" as const;
  }

  const attemptedAt = new Date().toISOString();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    await patchDelivery(order._id, {
      donationEmailStatus: "pending",
      donationEmailLastAttemptAt: attemptedAt,
      donationEmailLastErrorCode: "RESEND_NOT_CONFIGURED",
    });
    console.error("Donation email delivery failed", {
      orderReference: order.orderReference,
      errorCode: "RESEND_NOT_CONFIGURED",
    });
    return "failed" as const;
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send(
      {
        from: process.env.CONTACT_EMAIL_FROM || defaultFrom,
        to: [process.env.CONTACT_EMAIL_TO || defaultTo],
        ...createDonationEmail(order),
      },
      { idempotencyKey: `wayforpay-donation-${order.occurrenceId}` },
    );

    if (error || !data) throw new Error("RESEND_SEND_FAILED");

    await patchDelivery(order._id, {
      donationEmailStatus: "sent",
      donationEmailLastAttemptAt: attemptedAt,
      donationEmailSentAt: new Date().toISOString(),
      donationEmailProviderId: data.id,
      donationEmailLastErrorCode: null,
    });
    return "sent" as const;
  } catch {
    await patchDelivery(order._id, {
      donationEmailStatus: "pending",
      donationEmailLastAttemptAt: attemptedAt,
      donationEmailLastErrorCode: "RESEND_SEND_FAILED",
    });
    console.error("Donation email delivery failed", {
      orderReference: order.orderReference,
      errorCode: "RESEND_SEND_FAILED",
    });
    return "failed" as const;
  }
};
