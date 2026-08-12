export const EVENT_REGISTRATION_ID = "event-registration";

/** Column order written to Google Sheets (header row should match). */
export const EVENT_REGISTRATION_SHEET_COLUMNS = [
  "submittedAt",
  "eventId",
  "locale",
  "fullName",
  "email",
  "phone",
  "petType",
  "petName",
  "comments",
] as const;

export { EVENT_REGISTRATION_SHEET_HEADERS_UK } from "./sheetLayout";

/** Default range; ensureRegistrationSheetLayout renames/creates tab «Реєстрації» as needed. */
export const DEFAULT_GOOGLE_SHEETS_RANGE = "Реєстрації!A:I";
