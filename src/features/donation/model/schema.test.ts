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

  it("accepts only the checkout contract fields", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 500,
      productName: "Donation",
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
      donationPurpose: "foundation",
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
    expect(createCheckoutRequestSchema.safeParse({ amount: 1.001, isAgreed: true }).success).toBe(false);
    expect(createCheckoutRequestSchema.safeParse({ amount: 0.99, isAgreed: true }).success).toBe(false);
    expect(createCheckoutRequestSchema.safeParse({ amount: 1_000_000.01, isAgreed: true }).success).toBe(false);
  });

  it("normalizes an optional description of the selected donation item", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 100,
      isAgreed: true,
      donationItemDescription: "  1 день харчування цуценятка / кошенятка  ",
    });

    expect(result.donationItemDescription).toBe("1 день харчування цуценятка / кошенятка");
  });

  it("accepts anonymous checkout without a name", () => {
    const result = createCheckoutRequestSchema.parse({
      amount: 500,
      isAgreed: true,
      isAnonymous: true,
    });

    expect(result).toMatchObject({ fullName: "", isAnonymous: true });
  });

  it("requires explicit recurring consent and enforces schedules by purpose", () => {
    const monthlyFoundation = {
      amount: 500,
      isAgreed: true,
      donationSchedule: "monthly",
    };
    expect(createCheckoutRequestSchema.safeParse(monthlyFoundation).success).toBe(false);
    expect(createCheckoutRequestSchema.safeParse({
      ...monthlyFoundation,
      isRecurringAgreed: true,
    }).success).toBe(true);
    expect(createCheckoutRequestSchema.safeParse({
      ...monthlyFoundation,
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
