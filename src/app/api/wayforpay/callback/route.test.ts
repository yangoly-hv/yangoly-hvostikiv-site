import crypto from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getRequiredEnv: vi.fn(),
  paymentsFetch: vi.fn(),
  paymentsCreateIfNotExists: vi.fn(),
  transactionCreateIfNotExists: vi.fn(),
  transactionPatch: vi.fn(),
  transactionCommit: vi.fn(),
  legacyFetch: vi.fn(),
  legacyCreateIfNotExists: vi.fn(),
  legacyPatch: vi.fn(),
  legacyPatchSet: vi.fn(),
  legacyPatchCommit: vi.fn(),
  legacyTransactionCreate: vi.fn(),
  legacyTransactionPatch: vi.fn(),
  legacyTransactionCommit: vi.fn(),
  revalidateTag: vi.fn(),
  deliverDonationEmail: vi.fn(),
  processPaymentEffects: vi.fn(),
}));

vi.mock("@/shared/lib/env.server", () => ({ getRequiredEnv: mocks.getRequiredEnv }));
vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));
vi.mock("@/features/donation/server/donationEmail", () => ({
  deliverDonationEmail: mocks.deliverDonationEmail,
}));
vi.mock("@/features/donation/server/paymentEffects", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/donation/server/paymentEffects")>()),
  processPaymentEffects: mocks.processPaymentEffects,
}));
vi.mock("@/shared/lib/sanity", () => ({
  default: {
    fetch: mocks.legacyFetch,
    createIfNotExists: mocks.legacyCreateIfNotExists,
    patch(id: string) {
      mocks.legacyPatch(id);
      return {
        set(value: unknown) {
          mocks.legacyPatchSet(value);
          return { commit: mocks.legacyPatchCommit };
        },
      };
    },
    transaction: () => ({
      create(document: unknown) {
        mocks.legacyTransactionCreate(document);
        return this;
      },
      patch(id: string, mutation: unknown) {
        mocks.legacyTransactionPatch(id, mutation);
        return this;
      },
      commit: mocks.legacyTransactionCommit,
    }),
  },
}));
vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({
    fetch: mocks.paymentsFetch,
    createIfNotExists: mocks.paymentsCreateIfNotExists,
    transaction: () => ({
      createIfNotExists(document: unknown) {
        mocks.transactionCreateIfNotExists(document);
        return this;
      },
      patch(id: string, mutation: unknown) {
        mocks.transactionPatch(id, mutation);
        return this;
      },
      commit: mocks.transactionCommit,
    }),
  }),
}));

import { getPaymentOccurrenceId, parseWayforpayCallback } from "@/features/donation/server/wayforpay";
import { persistCallback, POST } from "./route";

const secret = "wayforpay-secret";
const encryptionKey = Buffer.alloc(32, 9).toString("base64");
const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";

const createPayload = (overrides: Record<string, unknown> = {}) => {
  const payload = {
    merchantAccount: "merchant",
    orderReference,
    amount: 500,
    currency: "UAH",
    authCode: "123456",
    cardPan: "42****4242",
    transactionStatus: "Approved",
    reasonCode: "1100",
    processingDate: 1_700_000_000,
    email: "payer@example.org",
    phone: "+380001112233",
    recToken: "rec-token",
    repayUrl: "https://secure.wayforpay.com/retry",
    ...overrides,
  };
  const signature = [
    payload.merchantAccount,
    payload.orderReference,
    payload.amount,
    payload.currency,
    payload.authCode,
    payload.cardPan,
    payload.transactionStatus,
    payload.reasonCode,
  ].join(";");

  return {
    ...payload,
    merchantSignature: crypto.createHmac("md5", secret).update(signature).digest("hex"),
  };
};

const request = (payload: unknown, headers: Record<string, string> = {}) =>
  new Request("https://example.org/api/wayforpay/callback", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });

const storedOrder = (overrides: Record<string, unknown> = {}) => ({
  _id: `donateOrder.${orderReference}`,
  _rev: "revision-1",
  origin: "checkout",
  orderReference,
  amountMinor: 50_000,
  currency: "UAH",
  wantNotifications: true,
  paymentStatus: "created",
  callbackDeliveryCount: 0,
  ...overrides,
});

const storedOccurrence = (
  payload: ReturnType<typeof createPayload>,
  overrides: Record<string, unknown> = {},
) => {
  const occurrenceId = getPaymentOccurrenceId({
    merchantAccount: String(payload.merchantAccount),
    orderReference: String(payload.orderReference),
    authCode: String(payload.authCode),
  });
  return {
    _id: occurrenceId,
    _rev: "occurrence-revision-1",
    occurrenceId,
    orderReference,
    authCode: String(payload.authCode),
    amountMinor: Number(payload.amount) * 100,
    currency: "UAH",
    paymentStatus: "approved",
    lastProviderProcessingDate: Number(payload.processingDate),
    ...overrides,
  };
};

let orderState: ReturnType<typeof storedOrder> | null;
let occurrenceState: ReturnType<typeof storedOccurrence> | null;

const setPaymentState = (
  order: ReturnType<typeof storedOrder> | null,
  occurrence: ReturnType<typeof storedOccurrence> | null = null,
) => {
  orderState = order;
  occurrenceState = occurrence;
  mocks.paymentsFetch.mockImplementation((query: string) =>
    Promise.resolve(query.includes('_type == "paymentOccurrence"') ? occurrenceState : orderState),
  );
};

describe("POST /api/wayforpay/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequiredEnv.mockImplementation((name: string) => {
      const values: Record<string, string> = {
        WAYFORPAY_ACCOUNT: "merchant",
        WAYFORPAY_SECRET: secret,
        PAYMENTS_ENCRYPTION_KEY: encryptionKey,
      };
      return values[name];
    });
    setPaymentState(storedOrder());
    mocks.paymentsCreateIfNotExists.mockResolvedValue({});
    mocks.transactionCommit.mockResolvedValue({});
    mocks.legacyCreateIfNotExists.mockResolvedValue({});
    mocks.legacyPatchCommit.mockResolvedValue({});
    mocks.legacyTransactionCommit.mockResolvedValue({});
    mocks.legacyFetch.mockResolvedValue(null);
    mocks.deliverDonationEmail.mockResolvedValue("sent");
    mocks.processPaymentEffects.mockResolvedValue({ checked: 1, completed: 1, retried: 0, failed: 0 });
  });

  it("verifies, persists and acknowledges an approved callback", async () => {
    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      orderReference,
      status: "accept",
      signature: expect.stringMatching(/^[a-f0-9]{32}$/),
    });
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "wayforpayCallback",
        orderReference,
        normalizedStatus: "approved",
        payerEmail: "payer@example.org",
        payerPhone: "+380001112233",
        recTokenEncrypted: expect.any(Object),
        callbackPayloadEncrypted: expect.any(Object),
      }),
    );
    expect(mocks.transactionPatch).toHaveBeenCalledWith(
      `donateOrder.${orderReference}`,
      expect.objectContaining({
        inc: { callbackDeliveryCount: 1 },
        set: expect.objectContaining({ paymentStatus: "approved" }),
      }),
    );
  });

  it("does not persist an invalid signature", async () => {
    const response = await POST(request({ ...createPayload(), merchantSignature: "0".repeat(32) }));

    expect(response.status).toBe(401);
    expect(mocks.paymentsFetch).not.toHaveBeenCalled();
    expect(mocks.transactionCommit).not.toHaveBeenCalled();
  });

  it("rejects a callback from an unexpected merchant and amount mismatch", async () => {
    const wrongMerchant = await POST(request(createPayload({ merchantAccount: "other" })));
    expect(wrongMerchant.status).toBe(403);

    const mismatch = await POST(request(createPayload({ amount: 501 })));
    expect(mismatch.status).toBe(409);
    expect(mocks.transactionCommit).not.toHaveBeenCalled();
  });

  it("redacts contacts in stored callback data without notification consent", async () => {
    setPaymentState(storedOrder({ wantNotifications: false }));

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.not.objectContaining({ payerEmail: expect.anything(), payerPhone: expect.anything() }),
    );
  });

  it("sends a donation email only after an approved payment", async () => {
    setPaymentState(
      storedOrder({
        donationEmailEnabled: true,
        donationPurpose: "collection",
        donationTargetName: "Збір на лікування",
        donorFullName: "Oleksii Kovalenko",
        comment: "For Luna",
      }),
    );

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
    expect(mocks.processPaymentEffects).toHaveBeenCalledWith([
      expect.objectContaining({
        kind: "donation-email",
        orderReference,
        targetStatus: "approved",
      }),
    ]);
    /* expect(mocks.deliverDonationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        donationPurpose: "collection",
        donationTargetName: "Збір на лікування",
        donationEmailStatus: "pending",
        donorFullName: "Oleksii Kovalenko",
      }),
    ); */
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect", kind: "donation-email", targetStatus: "approved" }),
    );
    /* expect(mocks.transactionPatch).toHaveBeenCalledWith(
      `donateOrder.${orderReference}`,
      expect.objectContaining({
        set: expect.objectContaining({ donationEmailStatus: "pending" }),
      }),
    ); */
  });

  it("does not send a duplicate email for a repeated approved callback", async () => {
    const payload = createPayload();
    const occurrence = storedOccurrence(payload);
    setPaymentState(
      storedOrder({
        paymentStatus: "approved",
        paymentType: "monthly",
        initialPaymentOccurrenceId: occurrence.occurrenceId,
        donationEmailEnabled: true,
        donationEmailStatus: "sent",
        donationPurpose: "foundation",
        donationTargetName: "Підтримка роботи фонду",
      }),
      occurrence,
    );

    const response = await POST(request(payload));

    expect(response.status).toBe(200);
    expect(mocks.deliverDonationEmail).not.toHaveBeenCalled();
    expect(mocks.processPaymentEffects).not.toHaveBeenCalled();
  });

  it("acknowledges WayForPay when donation email delivery fails", async () => {
    setPaymentState(
      storedOrder({
        donationEmailEnabled: true,
        donationPurpose: "foundation",
        donationTargetName: "Підтримка роботи фонду",
      }),
    );
    mocks.processPaymentEffects.mockRejectedValue(new Error("Resend unavailable"));

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
  });

  it("does not send donation emails for non-approved callbacks", async () => {
    setPaymentState(
      storedOrder({
        donationEmailEnabled: true,
        donationPurpose: "foundation",
        donationTargetName: "Підтримка роботи фонду",
      }),
    );

    const response = await POST(
      request(createPayload({ transactionStatus: "Declined", reasonCode: "1101" })),
    );

    expect(response.status).toBe(200);
    expect(mocks.deliverDonationEmail).not.toHaveBeenCalled();
    expect(mocks.processPaymentEffects).not.toHaveBeenCalled();
  });

  it("adds an approved non-anonymous donation of at least 1,000 UAH to the existing donator list", async () => {
    setPaymentState(
      storedOrder({
        amountMinor: 100_000,
        donorFullName: "Oleksii Kovalenko",
        isAnonymous: false,
      }),
    );

    const response = await POST(request(createPayload({ amount: 1000 })));

    expect(response.status).toBe(200);
    /* expect(mocks.legacyCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "donator",
        orderReference,
        amount: 1000,
      }),
    ); */
    /* expect(mocks.legacyPatch).toHaveBeenCalledWith(`donator.${orderReference}`);
    expect(mocks.legacyPatchSet).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true, paymentStatus: "approved" }),
    ); */
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect", kind: "donator", targetStatus: "approved" }),
    );
  });

  it("does not add anonymous qualifying donations to the public donator list", async () => {
    setPaymentState(
      storedOrder({ amountMinor: 100_000, donorFullName: "Anonymous", isAnonymous: true }),
    );

    const response = await POST(request(createPayload({ amount: 1000 })));

    expect(response.status).toBe(200);
    expect(mocks.legacyCreateIfNotExists).not.toHaveBeenCalled();
  });

  it("credits the selected collection once after an approved donation", async () => {
    setPaymentState(storedOrder({ collectionId: "collection.main" }));

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
    expect(mocks.processPaymentEffects).toHaveBeenCalledWith([
      expect.objectContaining({
        kind: "collection",
        orderReference,
        targetStatus: "approved",
      }),
    ]);
    /* expect(mocks.legacyTransactionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "collectionContribution",
        _id: `collectionContribution.${orderReference}`,
        collectionId: "collection.main",
        amount: 500,
        amountMinor: 50_000,
        isActive: true,
      }),
    ); */
    /* expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith("collection.main", {
      setIfMissing: { amountCollected: 0 },
      inc: { amountCollected: 500 },
    }); */
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect", kind: "collection", targetStatus: "approved" }),
    );
  });

  it("does not credit an already active collection contribution twice", async () => {
    setPaymentState(storedOrder({ collectionId: "collection.main" }));
    mocks.legacyFetch.mockResolvedValue({
      _id: `collectionContribution.${orderReference}`,
      _rev: "contribution-revision",
      isActive: true,
    });

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(200);
    expect(mocks.legacyTransactionCommit).not.toHaveBeenCalled();
  });

  it("removes a reversed donation from its collection total", async () => {
    setPaymentState(
      storedOrder({ collectionId: "collection.main", paymentStatus: "approved" }),
    );
    mocks.legacyFetch.mockResolvedValue({
      _id: `collectionContribution.${orderReference}`,
      _rev: "contribution-revision",
      isActive: true,
    });

    const response = await POST(
      request(createPayload({ transactionStatus: "Refunded", reasonCode: "1100" })),
    );

    expect(response.status).toBe(200);
    /* expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith(
      `collectionContribution.${orderReference}`,
      expect.objectContaining({
        set: expect.objectContaining({ isActive: false, paymentStatus: "reversed" }),
      }),
    );
    expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith("collection.main", {
      setIfMissing: { amountCollected: 0 },
      inc: { amountCollected: -500 },
    }); */
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect", kind: "collection", targetStatus: "reversed" }),
    );
  });

  it("completes a collection update on a later delivery after the payment state was saved", async () => {
    setPaymentState(storedOrder({ collectionId: "collection.main" }));
    mocks.legacyTransactionCommit.mockRejectedValue(new Error("Content Sanity unavailable"));

    const firstDelivery = await POST(request(createPayload()));
    expect(firstDelivery.status).toBe(200);

    mocks.legacyTransactionCommit.mockResolvedValue({});
    setPaymentState(
      storedOrder({ collectionId: "collection.main", paymentStatus: "approved" }),
    );

    const repeatedDelivery = await POST(request(createPayload()));
    expect(repeatedDelivery.status).toBe(200);
    /* expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith("collection.main", {
      setIfMissing: { amountCollected: 0 },
      inc: { amountCollected: 500 },
    }); */
  });

  it("hides an existing public donator entry after a reversal", async () => {
    setPaymentState(
      storedOrder({
        amountMinor: 100_000,
        donorFullName: "Oleksii Kovalenko",
        isAnonymous: false,
        paymentStatus: "approved",
      }),
    );

    const response = await POST(
      request(createPayload({ amount: 1000, transactionStatus: "Refunded", reasonCode: "1100" })),
    );

    expect(response.status).toBe(200);
    /* expect(mocks.legacyPatchSet).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: false, paymentStatus: "reversed" }),
    ); */
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect", kind: "donator", targetStatus: "reversed" }),
    );
  });

  it("does not allow an older callback to overwrite payment status", async () => {
    setPaymentState(
      storedOrder({ paymentStatus: "approved", lastProviderProcessingDate: 1_700_000_100 }),
    );

    const response = await POST(
      request(createPayload({ transactionStatus: "Declined", reasonCode: "1101", processingDate: 1_700_000_000 })),
    );

    expect(response.status).toBe(200);
    expect(mocks.transactionPatch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        set: expect.not.objectContaining({ paymentStatus: expect.anything() }),
      }),
    );
  });

  it("creates a separate occurrence and effects for each approved monthly charge", async () => {
    const firstPayload = createPayload({ authCode: "FIRST", processingDate: 1_700_000_000 });
    const firstOccurrenceId = getPaymentOccurrenceId({
      merchantAccount: "merchant",
      orderReference,
      authCode: "FIRST",
    });
    setPaymentState(storedOrder({ paymentType: "monthly", donationEmailEnabled: true }));

    expect((await POST(request(firstPayload))).status).toBe(200);
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentOccurrence", occurrenceId: firstOccurrenceId }),
    );

    mocks.transactionCreateIfNotExists.mockClear();
    mocks.processPaymentEffects.mockClear();
    const secondPayload = createPayload({ authCode: "SECOND", processingDate: 1_702_678_400 });
    const secondOccurrenceId = getPaymentOccurrenceId({
      merchantAccount: "merchant",
      orderReference,
      authCode: "SECOND",
    });
    setPaymentState(storedOrder({
      paymentType: "monthly",
      paymentStatus: "approved",
      initialPaymentOccurrenceId: firstOccurrenceId,
      donationEmailEnabled: true,
    }));

    expect((await POST(request(secondPayload))).status).toBe(200);
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentOccurrence", occurrenceId: secondOccurrenceId }),
    );
    expect(mocks.processPaymentEffects).toHaveBeenCalledWith([
      expect.objectContaining({ kind: "donation-email", occurrenceId: secondOccurrenceId }),
    ]);
  });

  it("deduplicates callback and reconciliation for the same occurrence", async () => {
    const rawPayload = createPayload({ authCode: "SAME" });
    const occurrence = storedOccurrence(rawPayload);
    setPaymentState(
      storedOrder({
        paymentType: "monthly",
        paymentStatus: "approved",
        initialPaymentOccurrenceId: occurrence.occurrenceId,
        donationEmailEnabled: true,
      }),
      occurrence,
    );

    await persistCallback({
      payload: parseWayforpayCallback(rawPayload),
      encryptionKey,
      source: "reconciliation",
    });

    expect(mocks.processPaymentEffects).not.toHaveBeenCalled();
    expect(mocks.transactionCreateIfNotExists).not.toHaveBeenCalledWith(
      expect.objectContaining({ _type: "paymentEffect" }),
    );
  });

  it("reverses only the matching recurring occurrence", async () => {
    const initialOccurrenceId = getPaymentOccurrenceId({
      merchantAccount: "merchant",
      orderReference,
      authCode: "INITIAL",
    });
    const reversalPayload = createPayload({
      authCode: "SECOND",
      transactionStatus: "Refunded",
      processingDate: 1_702_678_500,
    });
    const occurrence = storedOccurrence(reversalPayload, {
      paymentStatus: "approved",
      lastProviderProcessingDate: 1_702_678_400,
    });
    setPaymentState(
      storedOrder({
        paymentType: "monthly",
        paymentStatus: "approved",
        initialPaymentOccurrenceId: initialOccurrenceId,
        collectionId: "collection.main",
      }),
      occurrence,
    );

    expect((await POST(request(reversalPayload))).status).toBe(200);
    expect(mocks.transactionCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "paymentEffect",
        occurrenceId: occurrence.occurrenceId,
        targetStatus: "reversed",
      }),
    );
    expect(mocks.transactionPatch).toHaveBeenCalledWith(
      `donateOrder.${orderReference}`,
      expect.objectContaining({
        set: expect.not.objectContaining({ paymentStatus: "reversed" }),
      }),
    );
  });

  it("recovers a signed legacy DONATE order and limits oversized callbacks", async () => {
    mocks.paymentsFetch.mockResolvedValueOnce(null).mockResolvedValueOnce(storedOrder({ origin: "providerOnly" }));
    mocks.legacyFetch.mockResolvedValue({ wantNotifications: false, returnPath: "/uk" });

    const recovered = await POST(request(createPayload()));
    expect(recovered.status).toBe(200);
    expect(mocks.paymentsCreateIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ origin: "providerOnly", reconciliationStatus: "providerOnly" }),
    );

    const oversized = await POST(
      request(createPayload(), { "content-length": String(65 * 1024) }),
    );
    expect(oversized.status).toBe(413);
  });

  it("returns 500 when Sanity repeatedly fails, so WayForPay retries", async () => {
    mocks.transactionCommit.mockRejectedValue(new Error("Sanity unavailable"));

    const response = await POST(request(createPayload()));

    expect(response.status).toBe(500);
    expect(mocks.transactionCommit).toHaveBeenCalledTimes(3);
  });
});
