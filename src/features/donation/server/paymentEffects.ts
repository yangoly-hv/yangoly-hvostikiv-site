import "server-only";

import type { DonateOrder, PaymentOccurrence, PaymentStatus } from "@/shared/types/payment";
import { deliverDonationEmail } from "./donationEmail";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

export const paymentEffectKinds = ["collection", "donator", "donation-email"] as const;
export type PaymentEffectKind = (typeof paymentEffectKinds)[number];
export type PaymentEffectStatus = "pending" | "processing" | "completed" | "failed";

export type PaymentEffect = {
  _id: string;
  _rev?: string;
  kind: PaymentEffectKind;
  orderReference: string;
  occurrenceId: string;
  targetStatus: "approved" | "reversed";
  status: PaymentEffectStatus;
  attemptCount?: number;
  nextAttemptAt?: string;
};

const MAX_ATTEMPTS = 8;
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000, 6 * 60 * 60_000];
const PUBLIC_DONOR_MIN_AMOUNT_MINOR = 100_000;

export const getPaymentEffectId = (
  kind: PaymentEffectKind,
  occurrenceId: string,
  targetStatus: "approved" | "reversed",
) => `paymentEffect.${kind}.${targetStatus}.${occurrenceId}`;

export const getEffectsForPaymentStatus = (
  order: DonateOrder,
  occurrenceId: string,
  status: PaymentStatus,
) => {
  if (status !== "approved" && status !== "reversed") return [];
  const targetStatus = status;
  const effects: Array<Pick<PaymentEffect, "_id" | "kind" | "orderReference" | "occurrenceId" | "targetStatus" | "status">> = [];

  if (order.collectionId && order.amountMinor !== undefined) {
    effects.push({
      _id: getPaymentEffectId("collection", occurrenceId, targetStatus),
      kind: "collection",
      orderReference: order.orderReference,
      occurrenceId,
      targetStatus,
      status: "pending",
    });
  }
  if (
    (order.amountMinor ?? 0) >= PUBLIC_DONOR_MIN_AMOUNT_MINOR &&
    order.isAnonymous !== true &&
    typeof order.donorFullName === "string" &&
    order.donorFullName.trim().length > 0
  ) {
    effects.push({
      _id: getPaymentEffectId("donator", occurrenceId, targetStatus),
      kind: "donator",
      orderReference: order.orderReference,
      occurrenceId,
      targetStatus,
      status: "pending",
    });
  }
  if (status === "approved" && order.donationEmailEnabled === true) {
    effects.push({
      _id: getPaymentEffectId("donation-email", occurrenceId, targetStatus),
      kind: "donation-email",
      orderReference: order.orderReference,
      occurrenceId,
      targetStatus,
      status: "pending",
    });
  }
  return effects;
};

const collectionContributionId = (occurrenceId: string) => `collectionContribution.${occurrenceId}`;
const donatorId = (occurrenceId: string) => `donator.${occurrenceId}`;

const applyCollection = async (
  order: DonateOrder,
  occurrence: PaymentOccurrence,
  targetStatus: "approved" | "reversed",
) => {
  if (!order.collectionId || order.amountMinor === undefined) return;
  const [{ default: legacyClient }, { revalidateTag }, { sanityTags }] = await Promise.all([
    import("@/shared/lib/sanity"), import("next/cache"), import("@/shared/lib/sanityTags"),
  ]);
  const contributionId = collectionContributionId(occurrence.occurrenceId);
  const contribution = await legacyClient.fetch<{ _id: string; _rev?: string; isActive?: boolean } | null>(
    `*[_type == "collectionContribution" && _id == $contributionId][0]{ _id, _rev, isActive }`,
    { contributionId },
  );
  const isActive = targetStatus === "approved";
  if (contribution?.isActive === isActive) return;
  const amount = occurrence.amountMinor / 100;
  const now = new Date().toISOString();
  const transaction = legacyClient.transaction();
  if (contribution) {
    transaction.patch(contributionId, { ifRevisionID: contribution._rev, set: { isActive, paymentStatus: targetStatus, updatedAt: now } });
  } else if (isActive) {
    transaction.create({ _id: contributionId, _type: "collectionContribution", orderReference: order.orderReference, occurrenceId: occurrence.occurrenceId, collectionId: order.collectionId, amount, amountMinor: occurrence.amountMinor, isActive: true, paymentStatus: "approved", createdAt: now, updatedAt: now });
  } else {
    return;
  }
  transaction.patch(order.collectionId, { setIfMissing: { amountCollected: 0 }, inc: { amountCollected: isActive ? amount : -amount } });
  await transaction.commit();
  revalidateTag(sanityTags.collectionMain, { expire: 0 });
};

const applyDonator = async (
  order: DonateOrder,
  occurrence: PaymentOccurrence,
  targetStatus: "approved" | "reversed",
) => {
  if (!order.donorFullName || order.isAnonymous) return;
  const [{ default: legacyClient }, { revalidateTag }, { sanityTags }] = await Promise.all([
    import("@/shared/lib/sanity"), import("next/cache"), import("@/shared/lib/sanityTags"),
  ]);
  const id = donatorId(occurrence.occurrenceId);
  const isActive = targetStatus === "approved";
  await legacyClient.createIfNotExists({
    _id: id,
    _type: "donator",
    orderReference: order.orderReference,
    occurrenceId: occurrence.occurrenceId,
    name: { _type: "localizedString", uk: order.donorFullName, en: order.donorFullName },
    amount: occurrence.amountMinor / 100,
    currency: occurrence.currency,
    createdAt: new Date().toISOString(),
  });
  await legacyClient.patch(id).set({ isActive, paymentStatus: targetStatus, updatedAt: new Date().toISOString() }).commit();
  revalidateTag(sanityTags.donorsList, { expire: 0 });
};

const safeErrorCode = (error: unknown) =>
  error instanceof Error && error.message.includes("RESEND") ? "EMAIL_PROVIDER_ERROR" : "EFFECT_DELIVERY_ERROR";

export const processPaymentEffect = async (effect: PaymentEffect) => {
  const payments = getPaymentsClient();
  const result = await payments.fetch<{
    order: DonateOrder | null;
    occurrence: PaymentOccurrence | null;
  }>(
    `{
      "order": *[_type == "donateOrder" && orderReference == $orderReference][0]{
        _id, _rev, origin, orderReference, amountMinor, currency, collectionId, donationPurpose,
        donationTargetName, donationItemDescription, donationEmailEnabled, donorFullName, isAnonymous, comment,
        paymentType, paymentStatus
      },
      "occurrence": *[_type == "paymentOccurrence" && occurrenceId == $occurrenceId][0]{
        _id, _rev, occurrenceId, orderReference, authCode, amountMinor, currency, paymentStatus,
        providerTransactionStatus, providerReasonCode, providerReason,
        lastProviderProcessingDate, lastProviderProcessingAt,
        donationEmailStatus, donationEmailAttemptCount, donationEmailLastAttemptAt,
        donationEmailSentAt, donationEmailProviderId, donationEmailLastErrorCode
      }
    }`,
    { orderReference: effect.orderReference, occurrenceId: effect.occurrenceId },
  );
  const { order, occurrence } = result;
  if (!order) throw new Error("PAYMENT_ORDER_NOT_FOUND");
  if (!occurrence) throw new Error("PAYMENT_OCCURRENCE_NOT_FOUND");
  if (occurrence.paymentStatus !== effect.targetStatus) return;
  if (effect.kind === "collection") await applyCollection(order, occurrence, effect.targetStatus);
  if (effect.kind === "donator") await applyDonator(order, occurrence, effect.targetStatus);
  if (effect.kind === "donation-email") {
    if (!occurrence.amountMinor || !occurrence.currency || !order.donationPurpose || !order.donationTargetName) {
      throw new Error("EMAIL_ORDER_DATA_INVALID");
    }
    const result = await deliverDonationEmail({
      ...order,
      ...occurrence,
      _id: occurrence._id,
      occurrenceId: occurrence.occurrenceId,
      amountMinor: occurrence.amountMinor,
      currency: occurrence.currency,
      donationPurpose: order.donationPurpose,
      donationTargetName: order.donationTargetName,
    });
    if (result === "failed") throw new Error("EMAIL_PROVIDER_ERROR");
  }
};

export const processPaymentEffects = async (effects: readonly PaymentEffect[]) => {
  const payments = getPaymentsClient();
  const now = new Date().toISOString();
  let completed = 0;
  let retried = 0;
  let failed = 0;
  for (const effect of effects) {
    const attempts = (effect.attemptCount ?? 0) + 1;
    try {
      const processingPatch = payments.patch(effect._id).set({ status: "processing", attemptCount: attempts, lastAttemptAt: now });
      if (effect._rev) processingPatch.ifRevisionId(effect._rev);
      await processingPatch.commit();
      await processPaymentEffect(effect);
      await payments.patch(effect._id).set({ status: "completed", completedAt: new Date().toISOString(), lastErrorCode: null }).commit();
      completed += 1;
    } catch (error) {
      const terminal = attempts >= MAX_ATTEMPTS;
      const delay = RETRY_DELAYS_MS[Math.min(attempts - 1, RETRY_DELAYS_MS.length - 1)] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]!;
      await payments.patch(effect._id).set({ status: terminal ? "failed" : "pending", lastErrorCode: safeErrorCode(error), ...(terminal ? { failedAt: new Date().toISOString() } : { nextAttemptAt: new Date(Date.now() + delay).toISOString() }) }).commit();
      if (terminal) failed += 1;
      else retried += 1;
    }
  }
  return { checked: effects.length, completed, retried, failed };
};

export const processPendingPaymentEffects = async (limit: number) => {
  const payments = getPaymentsClient();
  const now = new Date().toISOString();
  const effects = await payments.fetch<PaymentEffect[]>(
    `*[_type == "paymentEffect" && status == "pending" && (!defined(nextAttemptAt) || dateTime(nextAttemptAt) <= dateTime($now))]
      | order(coalesce(nextAttemptAt, createdAt) asc)[0...$limit]{ _id, _rev, kind, orderReference, occurrenceId, targetStatus, status, attemptCount, nextAttemptAt }`,
    { now, limit },
  );

  return processPaymentEffects(effects);
};
