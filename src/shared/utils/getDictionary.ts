import { Locale } from "../types";

export const dictionaries = {
  uk: () =>
    import("../../../public/locales/uk/common.json").then(
      (module) => module.default
    ),
  en: () =>
    import("../../../public/locales/en/common.json").then(
      (module) => module.default
    ),
} as const;

export const getDictionary = async (locale: Locale) => {
  const loadDictionary = dictionaries[locale];
  if (!loadDictionary) {
    throw new Error(`Dictionary not found for locale: ${locale}`);
  }
  return await loadDictionary();
};
