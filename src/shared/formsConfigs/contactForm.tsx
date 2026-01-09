import * as yup from "yup";
import { IFormConfig, Locale } from "@/shared/types";
import { UkraineFlag } from "../../../public/images/icons";

const getContactFormConfig = (lang: Locale): IFormConfig => {
  const translations = {
    uk: {
      name: "Ваше ім'я",
      phone: "Ваш телефон",
      message: "Ваше повідомлення",
      placeholderName: "Анатолій",
      placeholderPhone: "+38",
      placeholderMessage: "Хочу стати партнером",
      phoneValidation: "Невірний формат телефону",
      requiredName: "Ім'я обов'язкове",
      requiredPhone: "Телефон обов'язковий",
      submitText: "ЗВ'ЯЖІТЬСЯ ЗІ МНОЮ",
      submiteddText: "Дякуємо за ваше повідомлення. Ми зв'яжемося з вами якнайшвидше!",
    },
    en: {
      name: "Your Name",
      phone: "Your Phone",
      message: "Your Message",
      placeholderName: "Anatolii",
      placeholderPhone: "+38",
      placeholderMessage: "I want to become a partner",
      phoneValidation: "Invalid phone format",
      requiredName: "Name is required",
      requiredPhone: "Phone is required",
      submitText: "CONTACT ME",
      submiteddText: "Thank you for your message. We will contact you as soon as possible!",
    },
  };

  const t = translations[lang];

  return {
    fields: [
      {
        name: "name",
        label: t.name,
        type: "text",
        required: true,
        validation: yup.string().required(t.requiredName),
        placeholder: t.placeholderName,
      },
      {
        name: "phone",
        label: t.phone,
        type: "tel",
        required: true,
        mask: "+38 (___) ___-__-__",
        placeholder: t.placeholderPhone,
        icon: <UkraineFlag />,
        validation: yup
          .string()
          .required(t.requiredPhone)
          .matches(/^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, t.phoneValidation),
      },
      {
        name: "message",
        label: t.message,
        type: "textarea",
        placeholder: t.placeholderMessage,
      },
    ],
    submitText: t.submitText,
    submiteddText: t.submiteddText,
  };
};

export default getContactFormConfig;
