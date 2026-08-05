import "server-only";

import crypto from "node:crypto";

import type { PaymentStatus } from "../model/payment";

export const WAYFORPAY_CALLBACK_MAX_BYTES = 64 * 1024;

export type { PaymentStatus } from "../model/payment";

export type EncryptedValue = {
  algorithm: "aes-256-gcm";
  keyVersion: 1;
  iv: string;
  authTag: string;
  ciphertext: string;
};

export type WayforpayCallback = {
  merchantAccount: string;
  orderReference: string;
  merchantSignature: string;
  amount: string;
  amountMinor: number;
  currency: string;
  authCode: string;
  cardPan: string;
  transactionStatus: string;
  normalizedStatus: Exclude<PaymentStatus, "created">;
  reasonCode: string;
  reason?: string;
  email?: string;
  phone?: string;
  createdDate?: number;
  processingDate?: number;
  cardType?: string;
  issuerBankCountry?: string;
  issuerBankName?: string;
  recToken?: string;
  fee?: string;
  paymentSystem?: string;
  repayUrl?: string;
  rawPayload: Record<string, unknown>;
};

export class WayforpayPayloadError extends Error {}

const requiredPrimitive = (payload: Record<string, unknown>, name: string) => {
  const value = payload[name];
  if (typeof value !== "string" && typeof value !== "number") {
    throw new WayforpayPayloadError(`Missing or invalid ${name}`);
  }

  return String(value);
};

const optionalPrimitive = (payload: Record<string, unknown>, name: string) => {
  const value = payload[name];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" && typeof value !== "number") {
    throw new WayforpayPayloadError(`Invalid ${name}`);
  }

  return String(value);
};

const optionalTimestamp = (payload: Record<string, unknown>, name: string) => {
  const value = optionalPrimitive(payload, name);
  if (value === undefined) return undefined;
  if (!/^\d{10}(?:\d{3})?$/.test(value)) {
    throw new WayforpayPayloadError(`Invalid ${name}`);
  }

  const timestamp = Number(value);
  if (!Number.isSafeInteger(timestamp)) {
    throw new WayforpayPayloadError(`Invalid ${name}`);
  }

  return timestamp;
};

export const moneyToMinor = (value: string | number) => {
  const raw = String(value);
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) {
    throw new WayforpayPayloadError("Invalid amount");
  }

  const [whole, fraction = ""] = raw.split(".");
  const amountMinor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new WayforpayPayloadError("Invalid amount");
  }

  return amountMinor;
};

export const minorToMoney = (amountMinor: number) => {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new Error("Invalid minor amount");
  }

  return (amountMinor / 100).toFixed(2);
};

const KYIV_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Kyiv",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const getNextMonthlyPaymentDate = (from: Date = new Date()) => {
  const parts = Object.fromEntries(
    KYIV_DATE_FORMATTER.formatToParts(from)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<"year" | "month" | "day", number>;
  const targetMonthIndex = parts.month;
  const targetYear = parts.year + Math.floor(targetMonthIndex / 12);
  const targetMonth = (targetMonthIndex % 12) + 1;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const targetDay = Math.min(parts.day, lastDay);

  return [
    String(targetDay).padStart(2, "0"),
    String(targetMonth).padStart(2, "0"),
    String(targetYear),
  ].join(".");
};

export const normalizePaymentStatus = (
  transactionStatus: string,
): Exclude<PaymentStatus, "created"> => {
  const status = transactionStatus.trim().toLowerCase();
  if (status === "approved") return "approved";
  if (/(refund|void|revers|chargeback)/.test(status)) return "reversed";
  if (/(declin|expired|fail|cancel)/.test(status)) return "failed";
  if (/(process|pending|waiting|hold)/.test(status)) return "pending";
  return "unknown";
};

export const parseWayforpayCallback = (value: unknown): WayforpayCallback => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new WayforpayPayloadError("Payload must be an object");
  }

  const rawPayload = value as Record<string, unknown>;
  const amount = requiredPrimitive(rawPayload, "amount");
  const transactionStatus = requiredPrimitive(rawPayload, "transactionStatus");
  const currency = requiredPrimitive(rawPayload, "currency").toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new WayforpayPayloadError("Invalid currency");
  }

  const merchantSignature = requiredPrimitive(rawPayload, "merchantSignature").toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(merchantSignature)) {
    throw new WayforpayPayloadError("Invalid merchantSignature");
  }

  return {
    merchantAccount: requiredPrimitive(rawPayload, "merchantAccount"),
    orderReference: requiredPrimitive(rawPayload, "orderReference"),
    merchantSignature,
    amount,
    amountMinor: moneyToMinor(amount),
    currency,
    authCode: requiredPrimitive(rawPayload, "authCode"),
    cardPan: requiredPrimitive(rawPayload, "cardPan"),
    transactionStatus,
    normalizedStatus: normalizePaymentStatus(transactionStatus),
    reasonCode: requiredPrimitive(rawPayload, "reasonCode"),
    reason: optionalPrimitive(rawPayload, "reason"),
    email: optionalPrimitive(rawPayload, "email"),
    phone: optionalPrimitive(rawPayload, "phone"),
    createdDate: optionalTimestamp(rawPayload, "createdDate"),
    processingDate: optionalTimestamp(rawPayload, "processingDate"),
    cardType: optionalPrimitive(rawPayload, "cardType"),
    issuerBankCountry: optionalPrimitive(rawPayload, "issuerBankCountry"),
    issuerBankName: optionalPrimitive(rawPayload, "issuerBankName"),
    recToken: optionalPrimitive(rawPayload, "recToken"),
    fee: optionalPrimitive(rawPayload, "fee"),
    paymentSystem: optionalPrimitive(rawPayload, "paymentSystem"),
    repayUrl: optionalPrimitive(rawPayload, "repayUrl"),
    rawPayload,
  };
};

export const getCallbackSignatureString = (payload: WayforpayCallback) =>
  [
    payload.merchantAccount,
    payload.orderReference,
    payload.amount,
    payload.currency,
    payload.authCode,
    payload.cardPan,
    payload.transactionStatus,
    payload.reasonCode,
  ].join(";");

export const verifyCallbackSignature = (
  payload: WayforpayCallback,
  secret: string,
) => {
  const expected = crypto
    .createHmac("md5", secret)
    .update(getCallbackSignatureString(payload), "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(payload.merchantSignature, "hex");
  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
};

export const createCallbackResponse = (
  orderReference: string,
  secret: string,
  time = Math.floor(Date.now() / 1000),
) => {
  const status = "accept";
  const signature = crypto
    .createHmac("md5", secret)
    .update(`${orderReference};${status};${time}`, "utf8")
    .digest("hex");

  return { orderReference, status, time, signature };
};

export const getCallbackEventId = (payload: WayforpayCallback) =>
  `wayforpayCallback.${crypto
    .createHash("sha256")
    .update(
      [
        payload.merchantSignature,
        payload.processingDate ?? "",
        payload.transactionStatus,
        payload.reasonCode,
      ].join(";"),
      "utf8",
    )
    .digest("hex")}`;

export const getPaymentOccurrenceId = (
  payload: Pick<WayforpayCallback, "merchantAccount" | "orderReference" | "authCode">,
) =>
  `paymentOccurrence.${crypto
    .createHash("sha256")
    .update(
      [payload.merchantAccount, payload.orderReference, payload.authCode].join(";"),
      "utf8",
    )
    .digest("hex")}`;

const getEncryptionKey = (base64Key: string) => {
  const key = Buffer.from(base64Key, "base64");
  if (key.length !== 32) {
    throw new Error("PAYMENTS_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }

  return key;
};

export const encryptJson = (value: unknown, base64Key: string): EncryptedValue => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(base64Key), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return {
    algorithm: "aes-256-gcm",
    keyVersion: 1,
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
};

export const redactPayloadContacts = (
  payload: Record<string, unknown>,
  wantNotifications: boolean,
) => {
  const redacted = { ...payload };
  if (!wantNotifications) {
    delete redacted.email;
    delete redacted.phone;
  }

  return redacted;
};

export const toIsoFromUnixSeconds = (value: number | undefined) => {
  if (value === undefined) return undefined;
  const date = new Date(value >= 100_000_000_000 ? value : value * 1000);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const statusPriority: Record<PaymentStatus, number> = {
  created: 0,
  unknown: 1,
  pending: 2,
  failed: 3,
  approved: 4,
  reversed: 5,
};

export const shouldAdvancePaymentStatus = ({
  currentStatus,
  currentProcessingDate,
  nextStatus,
  nextProcessingDate,
}: {
  currentStatus: PaymentStatus | undefined;
  currentProcessingDate: number | undefined;
  nextStatus: Exclude<PaymentStatus, "created">;
  nextProcessingDate: number | undefined;
}) => {
  if (currentProcessingDate !== undefined && nextProcessingDate !== undefined) {
    if (nextProcessingDate < currentProcessingDate) return false;
    if (nextProcessingDate > currentProcessingDate) return true;
  }

  if (currentStatus === nextStatus) return false;

  return statusPriority[nextStatus] >= statusPriority[currentStatus ?? "created"];
};

export const isDonateOrderReference = (orderReference: string) =>
  /^DONATE_[0-9a-f-]{36}$/i.test(orderReference);

export const getDonateOrderDocumentId = (orderReference: string) =>
  `donateOrder.${orderReference}`;
