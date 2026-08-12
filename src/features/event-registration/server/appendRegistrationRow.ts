import "server-only";

import { google } from "googleapis";

import {
  DEFAULT_GOOGLE_SHEETS_RANGE,
  EVENT_REGISTRATION_ID,
} from "../model/config";
import type { EventRegistrationSubmission } from "../model/schema";
import { petTypeLabelUk } from "../model/sheetLayout";
import { ensureRegistrationSheetLayout } from "./ensureRegistrationSheet";

export class SheetsUnavailableError extends Error {
  constructor(message = "SHEETS_UNAVAILABLE") {
    super(message);
    this.name = "SheetsUnavailableError";
  }
}

export class SheetsAppendError extends Error {
  constructor(message = "SHEETS_APPEND_FAILED") {
    super(message);
    this.name = "SheetsAppendError";
  }
}

const stripWrappingQuotes = (value: string) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return value;
};

const getSheetsConfig = () => {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const range =
    process.env.GOOGLE_SHEETS_RANGE?.trim() || DEFAULT_GOOGLE_SHEETS_RANGE;

  if (!clientEmail || !privateKeyRaw || !spreadsheetId) {
    return null;
  }

  return {
    clientEmail,
    privateKey: stripWrappingQuotes(privateKeyRaw).replace(/\\n/g, "\n"),
    spreadsheetId,
    range,
  };
};

export const appendRegistrationRow = async (
  submission: EventRegistrationSubmission,
  submittedAt = new Date(),
): Promise<void> => {
  const config = getSheetsConfig();
  if (!config) {
    throw new SheetsUnavailableError();
  }

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const row = [
    submittedAt.toISOString(),
    EVENT_REGISTRATION_ID,
    submission.locale,
    submission.fullName,
    submission.email,
    submission.phone,
    petTypeLabelUk(submission.petType),
    submission.petName,
    submission.comments || "",
  ];

  try {
    const appendRange = await ensureRegistrationSheetLayout(
      sheets,
      config.spreadsheetId,
      config.range,
    );

    // RAW keeps values like "+38 ..." as text; USER_ENTERED treats leading "+" as a formula.
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: appendRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    if (
      error instanceof SheetsUnavailableError ||
      error instanceof SheetsAppendError
    ) {
      throw error;
    }
    throw new SheetsAppendError();
  }
};
