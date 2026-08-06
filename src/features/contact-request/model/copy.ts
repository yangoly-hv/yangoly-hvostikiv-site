import type { Locale } from "@/shared/types";
import type { ContactRequestSource, ContactValidationCode } from "./schema";

export type ContactRequestCopy = {
  nameLabel: string;
  phoneLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
  submitText: string;
  successText: string;
  errorText: string;
  validation: Record<ContactValidationCode, string>;
};

const messagePlaceholders: Record<
  Locale,
  Record<ContactRequestSource | "default", string>
> = {
  uk: {
    default: "Розкажіть, чим хочете допомогти",
    "contact-page": "Розкажіть, чим хочете допомогти",
    partnership: "Хочу стати партнером",
    volunteering: "Хочу стати волонтером",
    "event-partnership": "Хочу стати партнером",
    "event-ambassador": "Хочу стати амбасадором",
    "event-volunteering": "Хочу стати волонтером",
  },
  en: {
    default: "Tell us how you’d like to help",
    "contact-page": "Tell us how you’d like to help",
    partnership: "I want to become a partner",
    volunteering: "I want to become a volunteer",
    "event-partnership": "I want to become a partner",
    "event-ambassador": "I want to become an ambassador",
    "event-volunteering": "I want to become a volunteer",
  },
};

const copyByLocale: Record<
  Locale,
  Omit<ContactRequestCopy, "messagePlaceholder">
> = {
  uk: {
    nameLabel: "Ваше ім'я",
    phoneLabel: "Ваш телефон",
    messageLabel: "Ваше повідомлення",
    namePlaceholder: "Анатолій",
    phonePlaceholder: "+38",
    submitText: "ЗВ'ЯЖІТЬСЯ ЗІ МНОЮ",
    successText: "Дякуємо за ваше повідомлення. Ми зв’яжемося з вами якнайшвидше!",
    errorText: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
    validation: {
      NAME_REQUIRED: "Вкажіть ваше ім’я.",
      NAME_TOO_LONG: "Ім’я має містити не більше 100 символів.",
      NAME_INVALID: "Використовуйте лише літери, пробіли, апостроф або дефіс.",
      PHONE_INVALID: "Вкажіть номер у форматі +38 (0XX) XXX-XX-XX.",
      MESSAGE_TOO_LONG: "Повідомлення має містити не більше 2000 символів.",
      HONEYPOT: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
    },
  },
  en: {
    nameLabel: "Your Name",
    phoneLabel: "Your Phone",
    messageLabel: "Your Message",
    namePlaceholder: "Anatolii",
    phonePlaceholder: "+38",
    submitText: "CONTACT ME",
    successText: "Thank you for your message. We will contact you as soon as possible!",
    errorText: "Failed to send your message. Please try again.",
    validation: {
      NAME_REQUIRED: "Enter your name.",
      NAME_TOO_LONG: "Name must be no longer than 100 characters.",
      NAME_INVALID: "Use only letters, spaces, apostrophes, or hyphens.",
      PHONE_INVALID: "Use the +38 (0XX) XXX-XX-XX format.",
      MESSAGE_TOO_LONG: "Message must be no longer than 2000 characters.",
      HONEYPOT: "Failed to send your message. Please try again.",
    },
  },
};

export const getContactRequestCopy = (
  locale: Locale,
  source: ContactRequestSource = "contact-page",
): ContactRequestCopy => ({
  ...copyByLocale[locale],
  messagePlaceholder:
    messagePlaceholders[locale][source] ?? messagePlaceholders[locale].default,
});
