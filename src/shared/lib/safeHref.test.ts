import { describe, expect, it } from "vitest";

import { getSafeHref, isExternalWebHref } from "./safeHref";

describe("getSafeHref", () => {
  it.each([
    "/uk/blog",
    "#details",
    "?page=2",
    "relative/path",
    "https://example.org/report.pdf",
    "http://example.org",
    "mailto:hello@example.org",
    "tel:+380000000000",
  ])("allows safe href %s", (href) => {
    expect(getSafeHref(href)).toBe(href);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//attacker.example",
    "relative\\path",
    "https://example.org\njavascript:alert(1)",
  ])("rejects unsafe href %s", (href) => {
    expect(getSafeHref(href)).toBeUndefined();
  });

  it("detects only absolute HTTP(S) links as external web links", () => {
    expect(isExternalWebHref("https://example.org")).toBe(true);
    expect(isExternalWebHref("mailto:hello@example.org")).toBe(false);
    expect(isExternalWebHref("/uk/blog")).toBe(false);
  });
});
