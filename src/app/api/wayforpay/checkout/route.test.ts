import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { resetCheckoutRateLimitForTests } from "./rateLimit";

const mocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
  getRequiredEnv: vi.fn(),
  contentFetch: vi.fn(),
}));

vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({ create: mocks.createOrder }),
}));
vi.mock("@/shared/lib/env.server", () => ({
  getRequiredEnv: mocks.getRequiredEnv,
}));
vi.mock("@/shared/lib/sanity", () => ({
  default: { fetch: mocks.contentFetch },
}));

import { POST } from "./route";

const request = (body: unknown) =>
  new NextRequest("http://localhost/api/wayforpay/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.org",
      "x-forwarded-for": "203.0.113.42",
    },
  });

const tailOneTime = {
  amount: 500,
  isAgreed: true,
  donationPurpose: "tail-one-time",
  donationTargetId: "tail.luna",
} as const;

describe("POST /api/wayforpay/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCheckoutRateLimitForTests();
    mocks.createOrder.mockResolvedValue({ _id: "order-1" });
    mocks.contentFetch.mockResolvedValue({ _id: "tail.luna", name: "Луна", keeping_price: 2500 });
    mocks.getRequiredEnv.mockImplementation((name: string) => {
      const values: Record<string, string> = {
        WAYFORPAY_ACCOUNT: "merchant",
        WAYFORPAY_SECRET: "secret",
        WAYFORPAY_DOMAIN: "example.org",
        NEXT_PUBLIC_BASE_URL: "https://example.org",
      };

      return values[name];
    });
  });

  it("creates an order reference and server-defined payment values", async () => {
    const response = await POST(
      request({
        ...tailOneTime,
        productName: "Client-controlled value",
        fullName: "Oleksii Kovalenko",
        isAnonymous: false,
        comment: "For Luna",
        donationItemDescription: "1 день харчування цуценятка / кошенятка",
        wantNotifications: true,
        returnPath: "/uk/fundraising",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.clone().json()).resolves.not.toHaveProperty("regularMode");
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "donateOrder",
        _id: expect.stringMatching(/^donateOrder\.DONATE_/),
        orderReference: expect.stringMatching(/^DONATE_/),
        amountMinor: 50000,
        currency: "UAH",
        paymentStatus: "created",
        paymentType: "oneTime",
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
        donationTargetName: "Луна",
        donationItemDescription: "1 день харчування цуценятка / кошенятка",
        donationEmailEnabled: true,
        productName: "Charitable donation to Angels of Tails",
        returnPath: "/uk/fundraising",
        comment: "For Luna",
        isAgreed: true,
        donorFullName: "Oleksii Kovalenko",
        isAnonymous: false,
        wantNotifications: false,
      }),
    );
  });

  it("ignores a client-supplied order reference", async () => {
    const response = await POST(
      request({
        ...tailOneTime,
        productName: "Donation",
        wantNotifications: false,
        orderReference: "CLIENT_CONTROLLED",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        orderReference: expect.stringMatching(/^DONATE_/),
      }),
    );
    expect(mocks.createOrder).not.toHaveBeenCalledWith(
      expect.objectContaining({ orderReference: "CLIENT_CONTROLLED" }),
    );
  });

  it("rejects cross-origin checkout attempts before creating an order", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/wayforpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://attacker.example" },
        body: JSON.stringify(tailOneTime),
      }),
    );

    expect(response.status).toBe(403);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("normalizes an unsafe return path before persisting the order", async () => {
    const response = await POST(request({ ...tailOneTime, returnPath: "//attacker.example" }));

    expect(response.status).toBe(200);
    expect(mocks.createOrder).toHaveBeenCalledWith(expect.objectContaining({ returnPath: "/" }));
  });

  it("rejects foundation and collection checkout while WayForPay is tails-only", async () => {
    const foundation = await POST(request({ amount: 500, isAgreed: true }));
    expect(foundation.status).toBe(400);

    const collection = await POST(
      request({
        amount: 500,
        isAgreed: true,
        donationPurpose: "collection",
        donationTargetId: "collection.main",
      }),
    );
    expect(collection.status).toBe(400);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("validates and snapshots a tail donation target on the server", async () => {
    mocks.contentFetch.mockResolvedValue({ _id: "tail.luna", name: "Луна" });

    const response = await POST(
      request({
        amount: 500,
        isAgreed: true,
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.contentFetch).toHaveBeenCalledWith(
      expect.stringContaining('"name": coalesce(name.uk, name.en)'),
      expect.objectContaining({ targetId: "tail.luna" }),
    );
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
        donationTargetName: "Луна",
      }),
    );
  });

  it("rejects a tail target without a resolved string name instead of crashing", async () => {
    mocks.contentFetch.mockResolvedValue({
      _id: "tail.luna",
      name: { uk: "Луна", en: "Luna" },
    });

    const response = await POST(
      request({
        amount: 500,
        isAgreed: true,
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Unknown donation target" });
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("rejects monthly checkout unless it is tail guardianship with consent", async () => {
    const missingConsent = await POST(
      request({
        amount: 2500,
        isAgreed: true,
        donationSchedule: "monthly",
        donationPurpose: "tail-guardianship",
        donationTargetId: "tail.luna",
      }),
    );
    expect(missingConsent.status).toBe(400);

    const foundationMonthly = await POST(
      request({
        amount: 500,
        isAgreed: true,
        donationSchedule: "monthly",
        isRecurringAgreed: true,
      }),
    );
    expect(foundationMonthly.status).toBe(400);

    const incompatiblePurpose = await POST(
      request({
        ...tailOneTime,
        donationSchedule: "monthly",
        isRecurringAgreed: true,
      }),
    );
    expect(incompatiblePurpose.status).toBe(400);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("creates a preset monthly WayForPay checkout for tail guardianship", async () => {
    const response = await POST(
      request({
        amount: 2500,
        isAgreed: true,
        donationSchedule: "monthly",
        isRecurringAgreed: true,
        donationPurpose: "tail-guardianship",
        donationTargetId: "tail.luna",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      regularMode: "monthly",
      regularBehavior: "preset",
      regularOn: 1,
      regularAmount: 2500,
      dateNext: expect.stringMatching(/^\d{2}\.\d{2}\.\d{4}$/),
      paymentSystems: "card;googlePay;applePay",
    });
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentType: "monthly",
        donationPurpose: "tail-guardianship",
        isRecurringAgreed: true,
        regularMode: "monthly",
        regularAmountMinor: 250_000,
        regularNextPaymentDate: expect.stringMatching(/^\d{2}\.\d{2}\.\d{4}$/),
      }),
    );
  });

  it("uses the server-side guardianship price and rejects a stale client amount", async () => {
    mocks.contentFetch.mockResolvedValue({
      _id: "tail.luna",
      name: "Луна",
      keeping_price: 2500,
    });

    const accepted = await POST(
      request({
        amount: 2500,
        isAgreed: true,
        donationSchedule: "monthly",
        isRecurringAgreed: true,
        donationPurpose: "tail-guardianship",
        donationTargetId: "tail.luna",
      }),
    );
    expect(accepted.status).toBe(200);
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        amountMinor: 250_000,
        donationPurpose: "tail-guardianship",
        paymentType: "monthly",
      }),
    );

    mocks.createOrder.mockClear();
    const stale = await POST(
      request({
        amount: 2000,
        isAgreed: true,
        donationSchedule: "monthly",
        isRecurringAgreed: true,
        donationPurpose: "tail-guardianship",
        donationTargetId: "tail.luna",
      }),
    );
    expect(stale.status).toBe(409);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("requires agreement on the server even if a browser bypasses form validation", async () => {
    const response = await POST(request({ ...tailOneTime, isAgreed: false }));

    expect(response.status).toBe(400);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("does not persist a full name for anonymous donations", async () => {
    const response = await POST(
      request({
        ...tailOneTime,
        isAnonymous: true,
        fullName: "Do not store me",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({ isAnonymous: true }),
    );
    expect(mocks.createOrder).not.toHaveBeenCalledWith(
      expect.objectContaining({ donorFullName: expect.anything() }),
    );
  });
});
