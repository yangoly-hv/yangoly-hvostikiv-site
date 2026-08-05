import type { Locale } from "@/shared/types";
import type { ContactValidationCode } from "./schema";

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

const copyByLocale: Record<Locale, ContactRequestCopy> = {
  uk: {
    nameLabel: "Ваше ім'я",
    phoneLabel: "Ваш телефон",
    messageLabel: "Ваше повідомлення",
    namePlaceholder: "Анатолій",
    phonePlaceholder: "+38",
    messagePlaceholder: "Хочу стати партнером",
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
    messagePlaceholder: "I want to become a partner",
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

export const getContactRequestCopy = (locale: Locale) => copyByLocale[locale];
