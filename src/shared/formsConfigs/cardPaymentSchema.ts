import * as yup from "yup";
import { Locale } from "@/shared/types";

const getCardPaymentSchema = (lang: Locale) => {
  const translations = {
    uk: {
      cardNumber: {
        invalid: "Невірний номер картки",
        required: "Номер картки обов'язковий",
      },
      expiryDate: {
        invalid: "Невірний термін дії картки (ДД/ММ/РРРР)",
        required: "Термін дії картки обов'язковий",
        expired: "Картка прострочена",
      },
      cvv: {
        invalid: "CVV повинен містити 3 цифри",
        required: "CVV обов'язковий",
      },
    },
    en: {
      cardNumber: {
        invalid: "Invalid card number",
        required: "Card number is required",
      },
      expiryDate: {
        invalid: "Invalid expiry date (DD/MM/YYYY)",
        required: "Expiry date is required",
        expired: "Card has expired",
      },
      cvv: {
        invalid: "CVV must be 3 digits",
        required: "CVV is required",
      },
    },
  };

  const t = translations[lang];

  return yup.object().shape({
    cardNumber: yup
      .string()
      .matches(/^\d{4} \d{4} \d{4} \d{4}$/, t.cardNumber.invalid)
      .required(t.cardNumber.required),
    expiryDate: yup
      .string()
      .matches(
        /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        t.expiryDate.invalid
      )
      .required(t.expiryDate.required)
      .test("expiry", t.expiryDate.expired, function (value) {
        if (!value) return false;
        const [day, month, year] = value.split("/");
        const expiryDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );
        return expiryDate > new Date();
      }),
    cvv: yup
      .string()
      .matches(/^\d{3}$/, t.cvv.invalid)
      .required(t.cvv.required),
  });
};

export default getCardPaymentSchema;
