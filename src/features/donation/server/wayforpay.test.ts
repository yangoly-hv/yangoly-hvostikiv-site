import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createCallbackResponse,
  encryptJson,
  getCallbackSignatureString,
  getNextMonthlyPaymentDate,
  moneyToMinor,
  normalizePaymentStatus,
  parseWayforpayCallback,
  redactPayloadContacts,
  shouldAdvancePaymentStatus,
  verifyCallbackSignature,
} from "./wayforpay";

const secret = "wayforpay-secret";
const encryptionKey = Buffer.alloc(32, 7).toString("base64");

const signedPayload = (overrides: Record<string, unknown> = {}) => {
  const draft = {
    merchantAccount: "merchant",
    orderReference: "DONATE_123e4567-e89b-12d3-a456-426614174000",
    amount: 500,
    currency: "UAH",
    authCode: "123456",
    cardPan: "42****4242",
    transactionStatus: "Approved",
    reasonCode: "1100",
    processingDate: 1_700_000_000,
    ...overrides,
  };
  const parsedDraft = parseWayforpayCallback({ ...draft, merchantSignature: "0".repeat(32) });
  const merchantSignature = crypto
    .createHmac("md5", secret)
    .update(getCallbackSignatureString(parsedDraft), "utf8")
    .digest("hex");

  return { ...draft, merchantSignature };
};

describe("WayForPay server helpers", () => {
  it("verifies the callback signature and creates a signed acceptance response", () => {
    const payload = parseWayforpayCallback(signedPayload());

    expect(verifyCallbackSignature(payload, secret)).toBe(true);
    expect(verifyCallbackSignature(payload, "wrong-secret")).toBe(false);
    expect(createCallbackResponse(payload.orderReference, secret, 123)).toEqual({
      orderReference: payload.orderReference,
      status: "accept",
      time: 123,
      signature: crypto
        .createHmac("md5", secret)
        .update(`${payload.orderReference};accept;123`, "utf8")
        .digest("hex"),
    });
  });

  it("normalizes money without floating point values", () => {
    expect(moneyToMinor("500")).toBe(50_000);
    expect(moneyToMinor("500.5")).toBe(50_050);
    expect(() => moneyToMinor("500.001")).toThrow("Invalid amount");
    expect(() => moneyToMinor("-1")).toThrow("Invalid amount");
  });

  it("calculates the next calendar month in Europe/Kyiv and clamps month-end", () => {
    expect(getNextMonthlyPaymentDate(new Date("2026-01-31T12:00:00Z"))).toBe("28.02.2026");
    expect(getNextMonthlyPaymentDate(new Date("2026-12-05T12:00:00Z"))).toBe("05.01.2027");
    expect(getNextMonthlyPaymentDate(new Date("2026-08-31T21:30:00Z"))).toBe("01.10.2026");
  });

  it("maps provider states and does not let older events override newer ones", () => {
    expect(normalizePaymentStatus("Approved")).toBe("approved");
    expect(normalizePaymentStatus("InProcessing")).toBe("pending");
    expect(normalizePaymentStatus("Declined")).toBe("failed");
    expect(normalizePaymentStatus("Refunded")).toBe("reversed");
    expect(normalizePaymentStatus("Mystery")).toBe("unknown");
    expect(
      shouldAdvancePaymentStatus({
        currentStatus: "approved",
        currentProcessingDate: 200,
        nextStatus: "failed",
        nextProcessingDate: 100,
      }),
    ).toBe(false);
  });

  it("redacts contacts without consent and encrypts payload values", () => {
    const redacted = redactPayloadContacts(
      { email: "payer@example.org", phone: "+380001112233", amount: 500 },
      false,
    );
    expect(redacted).toEqual({ amount: 500 });

    const encrypted = encryptJson({ recToken: "secret-token" }, encryptionKey);
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(encryptionKey, "base64"),
      Buffer.from(encrypted.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8");

    expect(JSON.parse(decrypted)).toEqual({ recToken: "secret-token" });
  });
});
