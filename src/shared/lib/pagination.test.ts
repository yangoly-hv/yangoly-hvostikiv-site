import { describe, expect, it } from "vitest";
import { getPageNumber } from "./pagination";

describe("getPageNumber", () => {
  it.each([
    [null, 5, 1],
    ["abc", 5, 1],
    ["-2", 5, 1],
    ["3", 5, 3],
    ["99", 5, 5],
    ["2", 0, 1],
  ])("normalizes %s for %s pages", (value, totalPages, expected) => {
    expect(getPageNumber(value, totalPages)).toBe(expected);
  });
});
