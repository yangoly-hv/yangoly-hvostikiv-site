import { describe, expect, it } from "vitest";
import { parseShowTopDonors } from "./showTopDonors";

describe("parseShowTopDonors", () => {
  it("treats a missing CMS value as enabled so the live table stays visible", () => {
    expect(parseShowTopDonors(undefined)).toBe(true);
    expect(parseShowTopDonors(null)).toBe(true);
  });

  it("honors an explicit off switch", () => {
    expect(parseShowTopDonors(false)).toBe(false);
  });

  it("honors an explicit on switch", () => {
    expect(parseShowTopDonors(true)).toBe(true);
  });
});
