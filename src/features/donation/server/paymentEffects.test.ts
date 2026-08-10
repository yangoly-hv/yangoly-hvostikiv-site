import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  paymentsFetch: vi.fn(),
  paymentsPatch: vi.fn(),
  paymentsPatchSet: vi.fn(),
  paymentsPatchCommit: vi.fn(),
  legacyFetch: vi.fn(),
  legacyTransactionCreate: vi.fn(),
  legacyTransactionPatch: vi.fn(),
  legacyTransactionCommit: vi.fn(),
  revalidateTag: vi.fn(),
  deliverDonationEmail: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));
vi.mock("@/features/donation/server/donationEmail", () => ({
  deliverDonationEmail: mocks.deliverDonationEmail,
}));
vi.mock("@/shared/lib/sanity", () => ({
  default: {
    fetch: mocks.legacyFetch,
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
    patch(id: string) {
      mocks.paymentsPatch(id);
      return {
        set(value: unknown) {
          mocks.paymentsPatchSet(value);
          return {
            ifRevisionId() {
              return this;
            },
            commit: mocks.paymentsPatchCommit,
          };
        },
      };
    },
  }),
}));

import {
  getEffectsForPaymentStatus,
  getPaymentEffectId,
  processPaymentEffect,
} from "./paymentEffects";

const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";
const occurrenceId = "paymentOccurrence.abc";

const baseOrder = {
  _id: `donateOrder.${orderReference}`,
  orderReference,
  amountMinor: 50_000,
  currency: "UAH",
  donationPurpose: "tail-one-time" as const,
  donationTargetId: "tail.luna",
  donationTargetName: "Луна",
};

const baseOccurrence = {
  _id: occurrenceId,
  occurrenceId,
  orderReference,
  authCode: "123456",
  amountMinor: 50_000,
  currency: "UAH",
  paymentStatus: "approved" as const,
};

describe("getEffectsForPaymentStatus", () => {
  it("enqueues a tail effect for approved tail-one-time donations", () => {
    const effects = getEffectsForPaymentStatus(baseOrder, occurrenceId, "approved");

    expect(effects).toContainEqual(
      expect.objectContaining({
        _id: getPaymentEffectId("tail", occurrenceId, "approved"),
        kind: "tail",
        orderReference,
        occurrenceId,
        targetStatus: "approved",
        status: "pending",
      }),
    );
  });

  it("enqueues a tail effect for reversed tail-one-time donations", () => {
    const effects = getEffectsForPaymentStatus(baseOrder, occurrenceId, "reversed");

    expect(effects).toContainEqual(
      expect.objectContaining({
        kind: "tail",
        targetStatus: "reversed",
      }),
    );
  });

  it("does not enqueue a tail effect for guardianship or foundation", () => {
    expect(
      getEffectsForPaymentStatus(
        { ...baseOrder, donationPurpose: "tail-guardianship" },
        occurrenceId,
        "approved",
      ).some((effect) => effect.kind === "tail"),
    ).toBe(false);

    expect(
      getEffectsForPaymentStatus(
        {
          ...baseOrder,
          donationPurpose: "foundation",
          donationTargetId: undefined,
        },
        occurrenceId,
        "approved",
      ).some((effect) => effect.kind === "tail"),
    ).toBe(false);
  });

  it("does not enqueue a tail effect without donationTargetId", () => {
    expect(
      getEffectsForPaymentStatus(
        { ...baseOrder, donationTargetId: undefined },
        occurrenceId,
        "approved",
      ).some((effect) => effect.kind === "tail"),
    ).toBe(false);
  });
});

describe("processPaymentEffect tail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.legacyTransactionCommit.mockResolvedValue({});
    mocks.paymentsPatchCommit.mockResolvedValue({});
  });

  it("credits the pet amountCollected once after an approved donation", async () => {
    mocks.paymentsFetch.mockResolvedValue({
      order: baseOrder,
      occurrence: baseOccurrence,
    });
    mocks.legacyFetch
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ slug: "luna" });

    await processPaymentEffect({
      _id: getPaymentEffectId("tail", occurrenceId, "approved"),
      kind: "tail",
      orderReference,
      occurrenceId,
      targetStatus: "approved",
      status: "processing",
    });

    expect(mocks.legacyTransactionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "tailContribution",
        _id: `tailContribution.${occurrenceId}`,
        tailId: "tail.luna",
        amount: 500,
        amountMinor: 50_000,
        isActive: true,
      }),
    );
    expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith("tail.luna", {
      setIfMissing: { amountCollected: 0 },
      inc: { amountCollected: 500 },
    });
    expect(mocks.revalidateTag).toHaveBeenCalledWith("tails:list", { expire: 0 });
    expect(mocks.revalidateTag).toHaveBeenCalledWith("tail:luna", { expire: 0 });
  });

  it("does not credit an already active tail contribution twice", async () => {
    mocks.paymentsFetch.mockResolvedValue({
      order: baseOrder,
      occurrence: baseOccurrence,
    });
    mocks.legacyFetch.mockResolvedValueOnce({
      _id: `tailContribution.${occurrenceId}`,
      _rev: "contribution-revision",
      isActive: true,
    });

    await processPaymentEffect({
      _id: getPaymentEffectId("tail", occurrenceId, "approved"),
      kind: "tail",
      orderReference,
      occurrenceId,
      targetStatus: "approved",
      status: "processing",
    });

    expect(mocks.legacyTransactionCommit).not.toHaveBeenCalled();
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("removes a reversed donation from the pet total", async () => {
    mocks.paymentsFetch.mockResolvedValue({
      order: baseOrder,
      occurrence: { ...baseOccurrence, paymentStatus: "reversed" },
    });
    mocks.legacyFetch
      .mockResolvedValueOnce({
        _id: `tailContribution.${occurrenceId}`,
        _rev: "contribution-revision",
        isActive: true,
      })
      .mockResolvedValueOnce({ slug: "luna" });

    await processPaymentEffect({
      _id: getPaymentEffectId("tail", occurrenceId, "reversed"),
      kind: "tail",
      orderReference,
      occurrenceId,
      targetStatus: "reversed",
      status: "processing",
    });

    expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith(
      `tailContribution.${occurrenceId}`,
      expect.objectContaining({
        set: expect.objectContaining({ isActive: false, paymentStatus: "reversed" }),
      }),
    );
    expect(mocks.legacyTransactionPatch).toHaveBeenCalledWith("tail.luna", {
      setIfMissing: { amountCollected: 0 },
      inc: { amountCollected: -500 },
    });
  });
});
