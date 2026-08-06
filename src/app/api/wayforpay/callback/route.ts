import { NextResponse } from "next/server";

import {
  WAYFORPAY_CALLBACK_MAX_BYTES,
  createCallbackResponse,
  encryptJson,
  getCallbackEventId,
  getDonateOrderDocumentId,
  getPaymentOccurrenceId,
  isDonateOrderReference,
  parseWayforpayCallback,
  redactPayloadContacts,
  shouldAdvancePaymentStatus,
  toIsoFromUnixSeconds,
  verifyCallbackSignature,
  type WayforpayCallback,
  WayforpayPayloadError,
} from "@/features/donation/server/wayforpay";
import type { DonateOrder, PaymentOccurrence } from "@/features/donation/model/payment";
import {
  getEffectsForPaymentStatus,
  processPaymentEffects,
} from "@/features/donation/server/paymentEffects";
import { getRequiredEnv } from "@/shared/lib/env.server";
import legacyClient from "@/shared/lib/sanity";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

type LegacyOrder = {
  returnPath?: string;
  comment?: string;
  isAgreed?: boolean;
  wantNotifications?: boolean;
  createdAt?: string;
};

class CallbackRouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const orderQuery = `
  *[_type == "donateOrder" && orderReference == $orderReference][0]{
    _id, _rev, origin, orderReference, amountMinor, currency,
    collectionId, donationPurpose, donationTargetName, donationEmailEnabled,
    donorFullName, isAnonymous, comment, wantNotifications, paymentType, paymentStatus,
    initialPaymentOccurrenceId,
    providerTransactionStatus, lastProviderProcessingDate, lastProviderProcessingAt
  }
`;

const occurrenceQuery = `
  *[_type == "paymentOccurrence" && _id == $occurrenceId][0]{
    _id, _rev, occurrenceId, orderReference, authCode, amountMinor, currency,
    paymentStatus, providerTransactionStatus, providerReasonCode, providerReason,
    lastProviderProcessingDate, lastProviderProcessingAt
  }
`;

const legacyOrderQuery = `
  *[_type == "donateOrder" && orderReference == $orderReference][0]{
    returnPath, comment, isAgreed, wantNotifications, createdAt
  }
`;

const readCallbackBody = async (request: Request) => {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > WAYFORPAY_CALLBACK_MAX_BYTES) {
    throw new CallbackRouteError("Callback body is too large", 413);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > WAYFORPAY_CALLBACK_MAX_BYTES) {
    throw new CallbackRouteError("Callback body is too large", 413);
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    const formData = new URLSearchParams(rawBody);
    if ([...formData.keys()].length === 0) {
      throw new WayforpayPayloadError("Callback body is not valid JSON or form data");
    }

    return Object.fromEntries(formData.entries());
  }
};

const logCallback = (
  result: "accepted" | "rejected" | "failed",
  payload: Pick<WayforpayCallback, "orderReference" | "transactionStatus" | "reasonCode">,
) => {
  console.info("WayForPay callback", {
    result,
    orderReference: payload.orderReference,
    transactionStatus: payload.transactionStatus,
    reasonCode: payload.reasonCode,
  });
};

const omitUndefined = <Value extends Record<string, unknown>>(value: Value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as Value;

const createRecoveredOrder = (
  payload: WayforpayCallback,
  legacyOrder: LegacyOrder | null,
) => ({
  _id: getDonateOrderDocumentId(payload.orderReference),
  _type: "donateOrder",
  schemaVersion: 1,
  origin: "providerOnly",
  reconciliationStatus: "providerOnly",
  orderReference: payload.orderReference,
  amountMinor: payload.amountMinor,
  expectedAmount: Number(payload.amount),
  currency: payload.currency,
  productName: "Recovered WayForPay donation",
  productCount: 1,
  paymentType: "oneTime",
  returnPath: legacyOrder?.returnPath ?? "/",
  comment: legacyOrder?.comment ?? "",
  isAgreed: legacyOrder?.isAgreed ?? false,
  wantNotifications: legacyOrder?.wantNotifications ?? false,
  createdAt: legacyOrder?.createdAt ?? toIsoFromUnixSeconds(payload.createdDate) ?? new Date().toISOString(),
  paymentStatus: "created",
  callbackDeliveryCount: 0,
});

export const persistCallback = async ({
  payload,
  encryptionKey,
  source = "callback",
}: {
  payload: WayforpayCallback;
  encryptionKey: string;
  source?: "callback" | "reconciliation";
}) => {
  const paymentsClient = getPaymentsClient();
  const eventId = source === "callback"
    ? getCallbackEventId(payload)
    : `${getCallbackEventId(payload)}.reconciliation`;
  const occurrenceId = getPaymentOccurrenceId(payload);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const order = await paymentsClient.fetch<DonateOrder | null>(orderQuery, {
      orderReference: payload.orderReference,
    });

    if (!order) {
      if (!isDonateOrderReference(payload.orderReference)) {
        throw new CallbackRouteError("Unknown order", 404);
      }

      const legacyOrder = await legacyClient.fetch<LegacyOrder | null>(legacyOrderQuery, {
        orderReference: payload.orderReference,
      });
      await paymentsClient.createIfNotExists(createRecoveredOrder(payload, legacyOrder));
      continue;
    }

    if (
      order.origin !== "providerOnly" &&
      (order.amountMinor !== payload.amountMinor || order.currency !== payload.currency)
    ) {
      throw new CallbackRouteError("Order amount or currency does not match", 409);
    }

    const occurrence = await paymentsClient.fetch<PaymentOccurrence | null>(occurrenceQuery, {
      occurrenceId,
    });

    const wantNotifications = order.wantNotifications === true;
    const encryptedRawPayload = encryptJson(
      redactPayloadContacts(payload.rawPayload, wantNotifications),
      encryptionKey,
    );
    const eventDocument = omitUndefined({
      _id: eventId,
      _type: "wayforpayCallback",
      schemaVersion: 1,
      source,
      orderReference: payload.orderReference,
      occurrenceId,
      receivedAt: new Date().toISOString(),
      signatureValid: true,
      merchantAccount: payload.merchantAccount,
      merchantSignature: payload.merchantSignature,
      amount: payload.amount,
      amountMinor: payload.amountMinor,
      currency: payload.currency,
      authCode: payload.authCode,
      cardPan: payload.cardPan,
      cardType: payload.cardType,
      issuerBankCountry: payload.issuerBankCountry,
      issuerBankName: payload.issuerBankName,
      transactionStatus: payload.transactionStatus,
      normalizedStatus: payload.normalizedStatus,
      reason: payload.reason,
      reasonCode: payload.reasonCode,
      fee: payload.fee,
      paymentSystem: payload.paymentSystem,
      createdDate: payload.createdDate,
      processingDate: payload.processingDate,
      processingDateIso: toIsoFromUnixSeconds(payload.processingDate),
      callbackPayloadEncrypted: { _type: "encryptedValue", ...encryptedRawPayload },
      ...(wantNotifications && payload.email ? { payerEmail: payload.email } : {}),
      ...(wantNotifications && payload.phone ? { payerPhone: payload.phone } : {}),
      ...(payload.recToken
        ? { recTokenEncrypted: { _type: "encryptedValue", ...encryptJson(payload.recToken, encryptionKey) } }
        : {}),
      ...(payload.repayUrl
        ? { repayUrlEncrypted: { _type: "encryptedValue", ...encryptJson(payload.repayUrl, encryptionKey) } }
        : {}),
    });

    const shouldAdvanceOccurrence = shouldAdvancePaymentStatus({
      currentStatus: occurrence?.paymentStatus,
      currentProcessingDate: occurrence?.lastProviderProcessingDate,
      nextStatus: payload.normalizedStatus,
      nextProcessingDate: payload.processingDate,
    });
    const effects = shouldAdvanceOccurrence
      ? getEffectsForPaymentStatus(order, occurrenceId, payload.normalizedStatus)
      : [];
    const isInitialOccurrence = order.initialPaymentOccurrenceId
      ? order.initialPaymentOccurrenceId === occurrenceId
      : order.paymentStatus !== "approved" || order.paymentType !== "monthly";
    const shouldAdvanceOrder = isInitialOccurrence && shouldAdvancePaymentStatus({
      currentStatus: order.paymentStatus,
      currentProcessingDate: order.lastProviderProcessingDate,
      nextStatus: payload.normalizedStatus,
      nextProcessingDate: payload.processingDate,
    });
    const providerUpdate = {
      providerTransactionStatus: payload.transactionStatus,
      providerReasonCode: payload.reasonCode,
      providerReason: payload.reason,
      lastProviderProcessingDate: payload.processingDate,
      lastProviderProcessingAt: toIsoFromUnixSeconds(payload.processingDate),
    };
    const occurrenceDocument = omitUndefined({
      _id: occurrenceId,
      _type: "paymentOccurrence",
      schemaVersion: 1,
      occurrenceId,
      orderReference: payload.orderReference,
      authCode: payload.authCode,
      amountMinor: payload.amountMinor,
      currency: payload.currency,
      paymentStatus: payload.normalizedStatus,
      ...providerUpdate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const orderUpdate = omitUndefined({
      ...(source === "callback"
        ? {
            lastCallbackAt: new Date().toISOString(),
            lastCallbackEventId: eventId,
          }
        : {}),
      ...(source === "reconciliation" ? { lastReconciledAt: new Date().toISOString() } : {}),
      ...(shouldAdvanceOrder
        ? {
            paymentStatus: payload.normalizedStatus,
            ...providerUpdate,
            ...(!order.initialPaymentOccurrenceId && payload.normalizedStatus === "approved"
              ? { initialPaymentOccurrenceId: occurrenceId }
              : {}),
            ...(wantNotifications && payload.email ? { payerEmail: payload.email } : {}),
            ...(wantNotifications && payload.phone ? { payerPhone: payload.phone } : {}),
          }
        : {}),
    });

    try {
      const transaction = paymentsClient
        .transaction()
        .createIfNotExists(eventDocument)
        .createIfNotExists(occurrenceDocument)
        .patch(order._id, {
          ifRevisionID: order._rev,
          set: orderUpdate,
          ...(source === "callback" ? { inc: { callbackDeliveryCount: 1 } } : {}),
        });

      if (occurrence && shouldAdvanceOccurrence) {
        transaction.patch(occurrence._id, {
          ifRevisionID: occurrence._rev,
          set: {
            paymentStatus: payload.normalizedStatus,
            ...providerUpdate,
            updatedAt: new Date().toISOString(),
          },
        });
      }

      if (shouldAdvanceOccurrence) {
        for (const effect of effects) {
          transaction.createIfNotExists({
            ...effect,
            _type: "paymentEffect",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      await transaction.commit();
      const immediateEffects = effects.filter(
        (effect) => effect.kind === "collection" || effect.kind === "donation-email",
      );
      if (immediateEffects.length > 0) {
        try {
          await processPaymentEffects(immediateEffects);
        } catch {
          console.error("Immediate payment effect delivery failed", {
            orderReference: order.orderReference,
          });
        }
      }
      return;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
};

export async function POST(request: Request) {
  let payload: WayforpayCallback | undefined;

  try {
    const merchantAccount = getRequiredEnv("WAYFORPAY_ACCOUNT");
    const secret = getRequiredEnv("WAYFORPAY_SECRET");
    const encryptionKey = getRequiredEnv("PAYMENTS_ENCRYPTION_KEY");
    payload = parseWayforpayCallback(await readCallbackBody(request));

    if (payload.merchantAccount !== merchantAccount) {
      throw new CallbackRouteError("Unexpected merchant account", 403);
    }
    if (!verifyCallbackSignature(payload, secret)) {
      throw new CallbackRouteError("Invalid merchant signature", 401);
    }

    await persistCallback({ payload, encryptionKey });
    logCallback("accepted", payload);
    return NextResponse.json(createCallbackResponse(payload.orderReference, secret));
  } catch (error) {
    if (payload) logCallback("rejected", payload);
    if (error instanceof CallbackRouteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof WayforpayPayloadError) {
      return NextResponse.json({ error: "Invalid callback payload" }, { status: 400 });
    }
    if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
    }

    console.error("WayForPay callback failed", {
      orderReference: payload?.orderReference,
      transactionStatus: payload?.transactionStatus,
      reasonCode: payload?.reasonCode,
    });
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}
