import type { Locale } from "@/shared/types";
import type { EventRegistrationValidationCode } from "./schema";

export type EventRegistrationCopy = {
  title: string;
  intro: string;
  fullNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  petTypeLabel: string;
  petTypeDog: string;
  petTypeCat: string;
  petNameLabel: string;
  commentsLabel: string;
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  petNamePlaceholder: string;
  commentsPlaceholder: string;
  submitText: string;
  successText: string;
  errorText: string;
  validation: Record<EventRegistrationValidationCode, string>;
};

const copyByLocale: Record<Locale, EventRegistrationCopy> = {
  uk: {
    title: "Реєстрація на захід",
    intro: "Заповніть форму, щоб зареєструватися. Ми збережемо ваші дані та зв’яжемося за потреби.",
    fullNameLabel: "ПІБ",
    emailLabel: "Email",
    phoneLabel: "Телефон",
    petTypeLabel: "Який у вас хвостик?",
    petTypeDog: "Песик",
    petTypeCat: "Котик",
    petNameLabel: "Ім’я хвостика",
    commentsLabel: "Коментар",
    fullNamePlaceholder: "Прізвище Ім’я По батькові",
    emailPlaceholder: "name@example.com",
    phonePlaceholder: "+38",
    petNamePlaceholder: "Ім’я вашого хвостика",
    commentsPlaceholder: "За бажанням",
    submitText: "ЗАРЕЄСТРУВАТИСЯ",
    successText: "Дякуємо! Вашу реєстрацію збережено.",
    errorText: "Не вдалося надіслати реєстрацію. Спробуйте ще раз.",
    validation: {
      FULL_NAME_REQUIRED: "Вкажіть ПІБ.",
      FULL_NAME_TOO_LONG: "ПІБ має містити не більше 100 символів.",
      FULL_NAME_INVALID: "Використовуйте лише літери, пробіли, апостроф або дефіс.",
      EMAIL_REQUIRED: "Вкажіть email.",
      EMAIL_INVALID: "Вкажіть коректний email.",
      PHONE_INVALID: "Вкажіть номер у форматі +38 (0XX) XXX-XX-XX.",
      PET_TYPE_REQUIRED: "Оберіть песика або котика.",
      PET_NAME_REQUIRED: "Вкажіть ім’я хвостика.",
      PET_NAME_TOO_LONG: "Ім’я хвостика має містити не більше 100 символів.",
      COMMENTS_TOO_LONG: "Коментар має містити не більше 2000 символів.",
      HONEYPOT: "Не вдалося надіслати реєстрацію. Спробуйте ще раз.",
    },
  },
  en: {
    title: "Event registration",
    intro: "Fill out the form to register. We will save your details and contact you if needed.",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    petTypeLabel: "What kind of tail do you have?",
    petTypeDog: "Dog",
    petTypeCat: "Cat",
    petNameLabel: "Pet name",
    commentsLabel: "Comments",
    fullNamePlaceholder: "Full name",
    emailPlaceholder: "name@example.com",
    phonePlaceholder: "+38",
    petNamePlaceholder: "Your pet’s name",
    commentsPlaceholder: "Optional",
    submitText: "REGISTER",
    successText: "Thank you! Your registration has been saved.",
    errorText: "Failed to submit registration. Please try again.",
    validation: {
      FULL_NAME_REQUIRED: "Enter your full name.",
      FULL_NAME_TOO_LONG: "Full name must be no longer than 100 characters.",
      FULL_NAME_INVALID: "Use only letters, spaces, apostrophes, or hyphens.",
      EMAIL_REQUIRED: "Enter your email.",
      EMAIL_INVALID: "Enter a valid email address.",
      PHONE_INVALID: "Use the +38 (0XX) XXX-XX-XX format.",
      PET_TYPE_REQUIRED: "Choose dog or cat.",
      PET_NAME_REQUIRED: "Enter your pet’s name.",
      PET_NAME_TOO_LONG: "Pet name must be no longer than 100 characters.",
      COMMENTS_TOO_LONG: "Comments must be no longer than 2000 characters.",
      HONEYPOT: "Failed to submit registration. Please try again.",
    },
  },
};

export const getEventRegistrationCopy = (locale: Locale): EventRegistrationCopy =>
  copyByLocale[locale];
