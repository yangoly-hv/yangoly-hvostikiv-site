import * as z from "zod/mini";

import { donationSchedules } from "./purpose";

export const donationAmountSchema = z
  .number("Enter a valid amount")
  .check(
    z.refine(
      (value) =>
        Number.isFinite(value) &&
        value >= 1 &&
        value <= 1_000_000 &&
        Math.round(value * 100) === value * 100,
      "Amount must be between 1 and 1,000,000 with no more than two decimal places",
    ),
  );

export const donationDraftSchema = z.object({
  amount: donationAmountSchema,
  fullName: z.pipe(
    z.optional(z.string()),
    z.pipe(
      z.transform<string | undefined, string>((value) => (value ?? "").trim()),
      z.string().check(z.maxLength(120)),
    ),
  ),
  isAnonymous: z.pipe(
    z.optional(z.boolean()),
    z.transform<boolean | undefined, boolean>((value) => value ?? false),
  ),
  comment: z.pipe(
    z.optional(z.string()),
    z.pipe(
      z.transform<string | undefined, string>((value) => (value ?? "").trim()),
      z.string().check(z.maxLength(500)),
    ),
  ),
  isAgreed: z.pipe(
    z.optional(z.boolean()),
    z.transform<boolean | undefined, boolean>((value) => value ?? false),
  ),
  donationSchedule: z.pipe(
    z.optional(z.enum(donationSchedules)),
    z.transform((value) => value ?? "oneTime"),
  ),
  isRecurringAgreed: z.pipe(
    z.optional(z.boolean()),
    z.transform<boolean | undefined, boolean>((value) => value ?? false),
  ),
});

export const createDonationFormSchema = () =>
  donationDraftSchema.check(
    z.refine(
      (values) => values.isAgreed,
      "Agreement is required",
    ),
    z.refine(
      (values) => values.donationSchedule !== "monthly" || values.isRecurringAgreed,
      "Recurring payment agreement is required",
    ),
  );

export const createCheckoutRequestSchema = z.extend(donationDraftSchema, {
  donationPurpose: z.enum(["tail-one-time", "tail-guardianship"]),
  donationTargetId: z.pipe(
    z.optional(z.string()),
    z.pipe(
      z.transform<string | undefined, string | undefined>((value) => value?.trim() || undefined),
      z.optional(z.string().check(z.maxLength(128))),
    ),
  ),
  donationItemDescription: z.pipe(
    z.optional(z.string()),
    z.pipe(
      z.transform<string | undefined, string | undefined>((value) => value?.trim() || undefined),
      z.optional(z.string().check(z.maxLength(200))),
    ),
  ),
  returnPath: z.optional(z.string()),
}).check(
  z.refine(
    (values) => values.isAgreed,
    "Agreement is required",
  ),
  z.refine(
    (values) => Boolean(values.donationTargetId),
    "A donation target is required for this purpose",
  ),
  z.refine(
    (values) => {
      if (values.donationPurpose === "tail-guardianship") {
        return values.donationSchedule === "monthly";
      }
      return values.donationSchedule === "oneTime";
    },
    "The donation schedule is not supported for this purpose",
  ),
  z.refine(
    (values) => values.donationSchedule !== "monthly" || values.isRecurringAgreed,
    "Recurring payment agreement is required",
  ),
);

export type DonationFormValues = z.input<typeof donationDraftSchema>;
export type CreateCheckoutRequest = z.output<typeof createCheckoutRequestSchema>;
