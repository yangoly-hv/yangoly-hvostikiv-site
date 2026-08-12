import { describe, expect, it } from "vitest";

import {
  EVENT_REGISTRATION_SHEET_HEADERS_UK,
  EVENT_REGISTRATION_SHEET_TAB_NAME,
  headersMatchExpected,
  normalizeHeaderCell,
  petTypeLabelUk,
  resolveRegistrationSheetTitle,
} from "./sheetLayout";

describe("sheetLayout", () => {
  it("normalizes header cells for comparison", () => {
    expect(normalizeHeaderCell("  ПІБ  ")).toBe("піб");
    expect(normalizeHeaderCell("Ім'я хвостика")).toBe("ім'я хвостика");
  });

  it("detects matching Ukrainian headers", () => {
    expect(
      headersMatchExpected([...EVENT_REGISTRATION_SHEET_HEADERS_UK]),
    ).toBe(true);
    expect(
      headersMatchExpected(
        EVENT_REGISTRATION_SHEET_HEADERS_UK.map((value) => ` ${value.toUpperCase()} `),
      ),
    ).toBe(true);
  });

  it("detects mismatched or short headers", () => {
    expect(headersMatchExpected([])).toBe(false);
    expect(headersMatchExpected(["ПІБ", "Email"])).toBe(false);
    expect(
      headersMatchExpected([
        "submittedAt",
        "eventId",
        "locale",
        "fullName",
        "email",
        "phone",
        "petType",
        "petName",
        "comments",
      ]),
    ).toBe(false);
  });

  it("keeps the preferred tab name when present", () => {
    expect(
      resolveRegistrationSheetTitle(["Sheet1", EVENT_REGISTRATION_SHEET_TAB_NAME], "Sheet1"),
    ).toBe(EVENT_REGISTRATION_SHEET_TAB_NAME);
  });

  it("falls back to configured tab or first existing tab", () => {
    expect(resolveRegistrationSheetTitle(["Sheet1"], "Sheet1")).toBe("Sheet1");
    expect(resolveRegistrationSheetTitle(["Дані"], "Missing")).toBe("Дані");
    expect(resolveRegistrationSheetTitle([], "Anything")).toBe(
      EVENT_REGISTRATION_SHEET_TAB_NAME,
    );
  });

  it("maps pet types to Ukrainian sheet labels", () => {
    expect(petTypeLabelUk("dog")).toBe("собака");
    expect(petTypeLabelUk("cat")).toBe("кіт");
  });
});
