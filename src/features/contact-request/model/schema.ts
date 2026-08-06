import * as z from "zod/mini";

export const CONTACT_PHONE_PATTERN = /^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/;
export const CONTACT_NAME_PATTERN = /^[\p{L}][\p{L}\p{M}'’ -]*$/u;
export const CONTACT_REQUEST_SOURCES = [
  "contact-page",
  "partnership",
  "volunteering",
  "event-partnership",
  "event-ambassador",
  "event-volunteering",
] as const;

export const ContactValidationCode = {
  nameRequired: "NAME_REQUIRED",
  nameTooLong: "NAME_TOO_LONG",
  nameInvalid: "NAME_INVALID",
  phoneInvalid: "PHONE_INVALID",
  messageTooLong: "MESSAGE_TOO_LONG",
  honeypot: "HONEYPOT",
} as const;

export type ContactValidationCode =
  (typeof ContactValidationCode)[keyof typeof ContactValidationCode];
export type ContactRequestSource = (typeof CONTACT_REQUEST_SOURCES)[number];

const normalizeInlineText = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeMessage = (value: string | undefined) =>
  (value ?? "").replace(/\r\n?/g, "\n").trim();

const nameSchema = z.pipe(
  z.pipe(z.string(), z.transform(normalizeInlineText)),
  z.string().check(
    z.minLength(1, ContactValidationCode.nameRequired),
    z.maxLength(100, ContactValidationCode.nameTooLong),
    z.regex(CONTACT_NAME_PATTERN, ContactValidationCode.nameInvalid),
  ),
);

const phoneSchema = z.pipe(
  z.pipe(z.string(), z.transform(normalizeInlineText)),
  z.string().check(z.regex(CONTACT_PHONE_PATTERN, ContactValidationCode.phoneInvalid)),
);

const messageSchema = z.pipe(
  z.pipe(z.optional(z.string()), z.transform(normalizeMessage)),
  z.string().check(z.maxLength(2000, ContactValidationCode.messageTooLong)),
);

export const contactRequestSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  message: messageSchema,
  website: z.pipe(
    z.pipe(
      z.optional(z.string()),
      z.transform<string | undefined, string>((value) => value ?? ""),
    ),
    z.string().check(z.maxLength(0, ContactValidationCode.honeypot)),
  ),
});

export const contactSubmissionSchema = z.extend(contactRequestSchema, {
  source: z.union([
    z.literal("contact-page"),
    z.literal("partnership"),
    z.literal("volunteering"),
    z.literal("event-partnership"),
    z.literal("event-ambassador"),
    z.literal("event-volunteering"),
  ]),
});

export type ContactRequestValues = z.input<typeof contactRequestSchema>;
export type ContactSubmission = z.output<typeof contactSubmissionSchema>;
