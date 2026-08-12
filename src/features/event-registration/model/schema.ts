import * as z from "zod/mini";

export const EVENT_PHONE_PATTERN = /^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/;
export const EVENT_FULL_NAME_PATTERN = /^[\p{L}][\p{L}\p{M}'’ -]*$/u;
export const EVENT_PET_TYPES = ["dog", "cat"] as const;
export const EVENT_LOCALES = ["uk", "en"] as const;

export const EventRegistrationValidationCode = {
  fullNameRequired: "FULL_NAME_REQUIRED",
  fullNameTooLong: "FULL_NAME_TOO_LONG",
  fullNameInvalid: "FULL_NAME_INVALID",
  emailRequired: "EMAIL_REQUIRED",
  emailInvalid: "EMAIL_INVALID",
  phoneInvalid: "PHONE_INVALID",
  petTypeRequired: "PET_TYPE_REQUIRED",
  petNameRequired: "PET_NAME_REQUIRED",
  petNameTooLong: "PET_NAME_TOO_LONG",
  commentsTooLong: "COMMENTS_TOO_LONG",
  honeypot: "HONEYPOT",
} as const;

export type EventRegistrationValidationCode =
  (typeof EventRegistrationValidationCode)[keyof typeof EventRegistrationValidationCode];
export type EventPetType = (typeof EVENT_PET_TYPES)[number];
export type EventRegistrationLocale = (typeof EVENT_LOCALES)[number];

const normalizeInlineText = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeComments = (value: string | undefined) =>
  (value ?? "").replace(/\r\n?/g, "\n").trim();

const fullNameSchema = z.pipe(
  z.pipe(z.string(), z.transform(normalizeInlineText)),
  z.string().check(
    z.minLength(1, EventRegistrationValidationCode.fullNameRequired),
    z.maxLength(100, EventRegistrationValidationCode.fullNameTooLong),
    z.regex(EVENT_FULL_NAME_PATTERN, EventRegistrationValidationCode.fullNameInvalid),
  ),
);

const emailSchema = z.pipe(
  z.pipe(
    z.pipe(z.string(), z.transform((value) => value.trim())),
    z.string().check(z.minLength(1, EventRegistrationValidationCode.emailRequired)),
  ),
  z.email(EventRegistrationValidationCode.emailInvalid),
);

const phoneSchema = z.pipe(
  z.pipe(z.string(), z.transform(normalizeInlineText)),
  z.string().check(z.regex(EVENT_PHONE_PATTERN, EventRegistrationValidationCode.phoneInvalid)),
);

const petNameSchema = z.pipe(
  z.pipe(z.string(), z.transform(normalizeInlineText)),
  z.string().check(
    z.minLength(1, EventRegistrationValidationCode.petNameRequired),
    z.maxLength(100, EventRegistrationValidationCode.petNameTooLong),
  ),
);

const commentsSchema = z.pipe(
  z.pipe(z.optional(z.string()), z.transform(normalizeComments)),
  z.string().check(z.maxLength(2000, EventRegistrationValidationCode.commentsTooLong)),
);

export const eventRegistrationFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  petType: z.union([z.literal("dog"), z.literal("cat")], {
    error: EventRegistrationValidationCode.petTypeRequired,
  }),
  petName: petNameSchema,
  comments: commentsSchema,
  website: z.pipe(
    z.pipe(
      z.optional(z.string()),
      z.transform<string | undefined, string>((value) => value ?? ""),
    ),
    z.string().check(z.maxLength(0, EventRegistrationValidationCode.honeypot)),
  ),
});

export const eventRegistrationSubmissionSchema = z.extend(eventRegistrationFormSchema, {
  locale: z.union([z.literal("uk"), z.literal("en")]),
});

export type EventRegistrationFormValues = z.input<typeof eventRegistrationFormSchema>;
export type EventRegistrationSubmission = z.output<typeof eventRegistrationSubmissionSchema>;
