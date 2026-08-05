import type { DonationPurpose } from "./donation";
import type { DonationSchedule } from "./donation";

export const paymentStatuses = ["created", "pending", "approved", "failed", "reversed", "unknown"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];
export type ResolvedPaymentStatus = Exclude<PaymentStatus, "created">;

export type DonateOrder = {
  _id: string; _rev?: string; origin?: "checkout" | "providerOnly"; orderReference: string;
  amountMinor?: number; currency?: string; collectionId?: string; donationPurpose?: DonationPurpose;
  donationTargetName?: string; donationItemDescription?: string; donationEmailEnabled?: boolean; donorFullName?: string;
  isAnonymous?: boolean; comment?: string; wantNotifications?: boolean; paymentStatus?: PaymentStatus;
  paymentType?: DonationSchedule; initialPaymentOccurrenceId?: string;
  providerTransactionStatus?: string; lastProviderProcessingDate?: number; lastProviderProcessingAt?: string;
};

export type PaymentOccurrence = {
  _id: string;
  _rev?: string;
  occurrenceId: string;
  orderReference: string;
  authCode: string;
  amountMinor: number;
  currency: string;
  paymentStatus?: PaymentStatus;
  providerTransactionStatus?: string;
  providerReasonCode?: string;
  providerReason?: string;
  lastProviderProcessingDate?: number;
  lastProviderProcessingAt?: string;
};

export const isPaymentStatus = (value: unknown): value is PaymentStatus =>
  typeof value === "string" && (paymentStatuses as readonly string[]).includes(value);
