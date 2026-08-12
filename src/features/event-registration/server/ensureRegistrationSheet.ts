import "server-only";

import type { sheets_v4 } from "googleapis";

import {
  EVENT_REGISTRATION_SHEET_HEADERS_UK,
  EVENT_REGISTRATION_SHEET_TAB_NAME,
  EVENT_REGISTRATION_SPREADSHEET_TITLE,
  headersMatchExpected,
  resolveRegistrationSheetTitle,
} from "../model/sheetLayout";

const HEADER_RANGE = (tabTitle: string) => `'${tabTitle.replace(/'/g, "''")}'!A1:I1`;
const DATA_RANGE = (tabTitle: string) => `'${tabTitle.replace(/'/g, "''")}'!A:I`;

const parseConfiguredTabTitle = (range: string) => {
  const [tabPart] = range.split("!");
  return (tabPart || EVENT_REGISTRATION_SHEET_TAB_NAME).replace(/^'|'$/g, "");
};

type SheetSummary = {
  sheetId: number;
  title: string;
};

const listSheets = (
  spreadsheet: sheets_v4.Schema$Spreadsheet,
): SheetSummary[] =>
  (spreadsheet.sheets ?? [])
    .map((sheet) => ({
      sheetId: sheet.properties?.sheetId,
      title: sheet.properties?.title,
    }))
    .filter(
      (sheet): sheet is SheetSummary =>
        typeof sheet.sheetId === "number" && typeof sheet.title === "string",
    );

/**
 * Ensures the spreadsheet title, worksheet tab name, and Ukrainian header row
 * match the registration layout. Returns the A:I range to append into.
 */
export const ensureRegistrationSheetLayout = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  configuredRange: string,
): Promise<string> => {
  const configuredTabTitle = parseConfiguredTabTitle(configuredRange);
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,sheets.properties(sheetId,title)",
  });

  const existingSheets = listSheets(spreadsheet.data);
  const requests: sheets_v4.Schema$Request[] = [];

  const currentTitle = spreadsheet.data.properties?.title?.trim() || "";
  if (currentTitle !== EVENT_REGISTRATION_SPREADSHEET_TITLE) {
    requests.push({
      updateSpreadsheetProperties: {
        properties: { title: EVENT_REGISTRATION_SPREADSHEET_TITLE },
        fields: "title",
      },
    });
  }

  let targetTitle = resolveRegistrationSheetTitle(
    existingSheets.map((sheet) => sheet.title),
    configuredTabTitle,
  );
  let targetSheet = existingSheets.find((sheet) => sheet.title === targetTitle);

  if (!targetSheet) {
    requests.push({
      addSheet: {
        properties: {
          title: EVENT_REGISTRATION_SHEET_TAB_NAME,
          index: 0,
        },
      },
    });
    targetTitle = EVENT_REGISTRATION_SHEET_TAB_NAME;
  } else if (targetSheet.title !== EVENT_REGISTRATION_SHEET_TAB_NAME) {
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: targetSheet.sheetId,
          title: EVENT_REGISTRATION_SHEET_TAB_NAME,
        },
        fields: "title",
      },
    });
    targetTitle = EVENT_REGISTRATION_SHEET_TAB_NAME;
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: HEADER_RANGE(targetTitle),
  });
  const currentHeaders = (headerResponse.data.values?.[0] ?? []).map((cell) =>
    String(cell ?? ""),
  );

  if (!headersMatchExpected(currentHeaders)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: HEADER_RANGE(targetTitle),
      valueInputOption: "RAW",
      requestBody: {
        values: [[...EVENT_REGISTRATION_SHEET_HEADERS_UK]],
      },
    });
  }

  return DATA_RANGE(targetTitle);
};
