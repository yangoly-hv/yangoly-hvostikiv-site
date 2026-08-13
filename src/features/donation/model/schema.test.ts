import { describe, expect, it } from "vitest";

import { createCheckoutRequestSchema, createDonationFormSchema } from "./schema";

describe("donation schemas", () => {
  it("always requires agreement for every donation flow", () => {
    const value = {
      amount: 500,
      comment: "For Luna",
      isAgreed: false,
    };

    expect(createDonationFormSchema().safeParse(value).success).toBe(false);
    expect(createDonationFormSchema().safeParse({ ...value, isAgreed: true }).success).toBe(true);
  });

  it("accepts only tail checkout contract fields", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 500,
      productName: "Donation",
      donationPurpose: "tail-one-time",
      donationTargetId: "tail.luna",
      fullName: "  Oleksii Kovalenko  ",
      isAnonymous: false,
      comment: "  For Luna  ",
      isAgreed: true,
      wantNotifications: true,
      returnPath: "/uk/fundraising",
      orderReference: "client-value",
    });

    expect(result).toEqual({
      amount: 500,
      donationPurpose: "tail-one-time",
      donationTargetId: "tail.luna",
      fullName: "Oleksii Kovalenko",
      isAnonymous: false,
      comment: "For Luna",
      isAgreed: true,
      donationSchedule: "oneTime",
      isRecurringAgreed: false,
      returnPath: "/uk/fundraising",
    });
  });

  it("rejects invalid money precision and out-of-range amounts", () => {
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 1.001,
        isAgreed: true,
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
      }).success,
    ).toBe(false);
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 0.99,
        isAgreed: true,
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
      }).success,
    ).toBe(false);
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 1_000_000.01,
        isAgreed: true,
        donationPurpose: "tail-one-time",
        donationTargetId: "tail.luna",
      }).success,
    ).toBe(false);
  });

  it("normalizes an optional description of the selected donation item", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 100,
      isAgreed: true,
      donationPurpose: "tail-one-time",
      donationTargetId: "tail.luna",
      donationItemDescription: "  1 день харчування цуценятка / кошенятка  ",
    });

    expect(result.donationItemDescription).toBe("1 день харчування цуценятка / кошенятка");
  });

  it("accepts anonymous checkout without a name", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 500,
      isAgreed: true,
      isAnonymous: true,
      donationPurpose: "tail-one-time",
      donationTargetId: "tail.luna",
    });

    expect(result).toMatchObject({ fullName: "", isAnonymous: true });
  });

  it("rejects foundation and collection checkout while WayForPay is tails-only", () => {
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 500,
        isAgreed: true,
      }).success,
    ).toBe(false);
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 500,
        isAgreed: true,
        donationPurpose: "foundation",
      }).success,
    ).toBe(false);
    expect(
      createCheckoutRequestSchema.safeParse({
        amount: 500,
        isAgreed: true,
        donationPurpose: "collection",
        donationTargetId: "collection.main",
      }).success,
    ).toBe(false);
  });

  it("requires explicit recurring consent and enforces schedules by purpose", () => {
    const monthlyGuardianship = {
      amount: 500,
      isAgreed: true,
      donationSchedule: "monthly",
      donationPurpose: "tail-guardianship",
      donationTargetId: "tail.luna",
    };
    expect(createCheckoutRequestSchema.safeParse(monthlyGuardianship).success).toBe(false);
    expect(createCheckoutRequestSchema.safeParse({
      ...monthlyGuardianship,
      isRecurringAgreed: true,
    }).success).toBe(true);
    expect(createCheckoutRequestSchema.safeParse({
      amount: 500,
      isAgreed: true,
      donationSchedule: "monthly",
      isRecurringAgreed: true,
      donationPurpose: "tail-one-time",
      donationTargetId: "tail.luna",
    }).success).toBe(false);
    expect(createCheckoutRequestSchema.safeParse({
      amount: 500,
      isAgreed: true,
      donationPurpose: "tail-guardianship",
      donationTargetId: "tail.luna",
      donationSchedule: "oneTime",
    }).success).toBe(false);
  });
});
