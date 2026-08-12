/** Preferred worksheet tab title inside the spreadsheet. */
export const EVENT_REGISTRATION_SHEET_TAB_NAME = "Реєстрації";

/** Preferred Google Spreadsheet document title. */
export const EVENT_REGISTRATION_SPREADSHEET_TITLE =
  "Янголи хвостиків — реєстрація на захід";

/** Ukrainian header row written to A1:I1 (order matches append row). */
export const EVENT_REGISTRATION_SHEET_HEADERS_UK = [
  "Дата подання",
  "ID події",
  "Мова",
  "ПІБ",
  "Email",
  "Телефон",
  "Тип хвостика",
  "Ім'я хвостика",
  "Коментар",
] as const;

/** Sheet display labels for stored petType values (`dog` | `cat`). */
export const EVENT_REGISTRATION_PET_TYPE_LABELS_UK = {
  dog: "собака",
  cat: "кіт",
} as const;

export const petTypeLabelUk = (petType: keyof typeof EVENT_REGISTRATION_PET_TYPE_LABELS_UK) =>
  EVENT_REGISTRATION_PET_TYPE_LABELS_UK[petType];

export const normalizeHeaderCell = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLocaleLowerCase("uk-UA");

export const headersMatchExpected = (
  actual: readonly string[],
  expected: readonly string[] = EVENT_REGISTRATION_SHEET_HEADERS_UK,
) => {
  if (actual.length < expected.length) return false;
  return expected.every(
    (header, index) =>
      normalizeHeaderCell(actual[index] ?? "") === normalizeHeaderCell(header),
  );
};

/**
 * Prefer the canonical Ukrainian tab name when it already exists.
 * Otherwise keep the configured tab if present, else the first sheet, else the canonical name.
 */
export const resolveRegistrationSheetTitle = (
  existingTitles: readonly string[],
  configuredTitle: string,
) => {
  if (existingTitles.includes(EVENT_REGISTRATION_SHEET_TAB_NAME)) {
    return EVENT_REGISTRATION_SHEET_TAB_NAME;
  }
  if (existingTitles.includes(configuredTitle)) {
    return configuredTitle;
  }
  if (existingTitles[0]) {
    return existingTitles[0];
  }
  return EVENT_REGISTRATION_SHEET_TAB_NAME;
};
