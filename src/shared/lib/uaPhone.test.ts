import { describe, expect, it } from "vitest";

import { formatUaPhoneMaskValue, toUaNationalPhoneDigits } from "./uaPhone";

describe("uaPhone", () => {
  it("normalizes full international autofill", () => {
    expect(toUaNationalPhoneDigits("+380680743331")).toBe("0680743331");
    expect(toUaNationalPhoneDigits("380680743331")).toBe("0680743331");
    expect(formatUaPhoneMaskValue("+380680743331")).toBe("+38 (068) 074-33-31");
  });

  it("keeps national numbers", () => {
    expect(toUaNationalPhoneDigits("0680743331")).toBe("0680743331");
    expect(formatUaPhoneMaskValue("0680743331")).toBe("+38 (068) 074-33-31");
  });

  it("fixes country code duplicated into the mask slots", () => {
    expect(toUaNationalPhoneDigits("+38 (380) 680-74-33")).toBe("06807433");
    expect(toUaNationalPhoneDigits("3838068074331")).toBe("068074331");
    expect(formatUaPhoneMaskValue("3838068074331")).toBe("+38 (068) 074-33-1");
  });

  it("formats already-correct masked values", () => {
    expect(formatUaPhoneMaskValue("+38 (068) 074-33-31")).toBe("+38 (068) 074-33-31");
  });
});
