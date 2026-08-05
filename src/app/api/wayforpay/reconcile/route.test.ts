import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getRequiredEnv: vi.fn(),
  paymentsFetch: vi.fn(),
  persistCallback: vi.fn(),
  parseWayforpayCallback: vi.fn(),
  verifyCallbackSignature: vi.fn(),
  processPendingPaymentEffects: vi.fn(),
}));

vi.mock("@/shared/lib/env.server", () => ({ getRequiredEnv: mocks.getRequiredEnv }));
vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({ fetch: mocks.paymentsFetch }),
}));
vi.mock("@/features/donation/server/wayforpay", () => ({
  parseWayforpayCallback: mocks.parseWayforpayCallback,
  verifyCallbackSignature: mocks.verifyCallbackSignature,
}));
vi.mock("@/features/donation/server/paymentEffects", () => ({
  processPendingPaymentEffects: mocks.processPendingPaymentEffects,
}));
vi.mock("../callback/route", () => ({ persistCallback: mocks.persistCallback }));

import { GET } from "./route";

describe("GET /api/wayforpay/reconcile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequiredEnv.mockImplementation((name: string) => ({
      CRON_SECRET: "cron-secret",
      WAYFORPAY_ACCOUNT: "merchant",
      WAYFORPAY_SECRET: "merchant-secret",
      PAYMENTS_ENCRYPTION_KEY: "encryption-key",
    })[name]);
    mocks.paymentsFetch
      .mockResolvedValueOnce([{ orderReference: "DONATE_123" }]);
    mocks.parseWayforpayCallback.mockReturnValue({
      merchantAccount: "merchant",
      orderReference: "DONATE_123",
      transactionStatus: "Approved",
      reasonCode: "1100",
    });
    mocks.verifyCallbackSignature.mockReturnValue(true);
    mocks.persistCallback.mockResolvedValue(undefined);
    mocks.processPendingPaymentEffects.mockResolvedValue({ checked: 0, completed: 0, retried: 0, failed: 0 });
  });

  it("requires cron authentication", async () => {
    const response = await GET(new Request("https://example.org/api/wayforpay/reconcile"));

    expect(response.status).toBe(401);
    expect(mocks.paymentsFetch).not.toHaveBeenCalled();
  });

  it("verifies and persists CHECK_STATUS responses as reconciliation events", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ provider: "response" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new Request("https://example.org/api/wayforpay/reconcile", {
        headers: { Authorization: "Bearer cron-secret" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      checked: 1,
      reconciled: 1,
      failed: 0,
      effects: { checked: 0, completed: 0, retried: 0, failed: 0 },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.wayforpay.com/api",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mocks.persistCallback).toHaveBeenCalledWith(
      expect.objectContaining({ source: "reconciliation", encryptionKey: "encryption-key" }),
    );
  });

  /* it("retries pending approved donation emails without checking WayForPay again", async () => {
    const pendingEmail = {
      _id: "donateOrder.DONATE_EMAIL",
      orderReference: "DONATE_EMAIL",
      amountMinor: 50000,
      currency: "UAH",
      donationPurpose: "foundation",
      donationTargetName: "Підтримка роботи фонду",
      donationEmailEnabled: true,
      donationEmailStatus: "pending",
    };
    mocks.paymentsFetch.mockReset();
    mocks.paymentsFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([pendingEmail]);
    mocks.deliverDonationEmail.mockResolvedValue("sent");

    const response = await GET(
      new Request("https://example.org/api/wayforpay/reconcile", {
        headers: { Authorization: "Bearer cron-secret" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      emailsChecked: 1,
      emailsSent: 1,
      emailsFailed: 0,
    });
    expect(mocks.deliverDonationEmail).toHaveBeenCalledWith(pendingEmail);
  }); */

  it("processes the effect queue without checking WayForPay again", async () => {
    mocks.paymentsFetch.mockReset();
    mocks.paymentsFetch.mockResolvedValueOnce([]);
    mocks.processPendingPaymentEffects.mockResolvedValue({ checked: 1, completed: 1, retried: 0, failed: 0 });

    const response = await GET(new Request("https://example.org/api/wayforpay/reconcile", {
      headers: { Authorization: "Bearer cron-secret" },
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      effects: { checked: 1, completed: 1, retried: 0, failed: 0 },
    });
    expect(mocks.processPendingPaymentEffects).toHaveBeenCalledWith(50);
  });
});
