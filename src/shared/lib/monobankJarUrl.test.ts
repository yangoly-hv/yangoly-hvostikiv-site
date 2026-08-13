import { describe, expect, it } from "vitest";

import { parseMonobankJarUrl } from "./monobankJarUrl";

describe("parseMonobankJarUrl", () => {
  it("normalizes public share links to https", () => {
    expect(parseMonobankJarUrl("http://send.monobank.ua/jar/9sNTEdMP79")).toBe(
      "https://send.monobank.ua/jar/9sNTEdMP79",
    );
    expect(parseMonobankJarUrl("https://www.send.monobank.ua/jar/9sNTEdMP79/")).toBe(
      "https://send.monobank.ua/jar/9sNTEdMP79",
    );
    expect(parseMonobankJarUrl("send.monobank.ua/jar/AU9jJCLcs8")).toBe(
      "https://send.monobank.ua/jar/AU9jJCLcs8",
    );
  });

  it("accepts a bare sendId", () => {
    expect(parseMonobankJarUrl("9sNTEdMP79")).toBe(
      "https://send.monobank.ua/jar/9sNTEdMP79",
    );
  });

  it("rejects empty values, widget URLs, and longJarId", () => {
    expect(parseMonobankJarUrl("")).toBeNull();
    expect(parseMonobankJarUrl("   ")).toBeNull();
    expect(parseMonobankJarUrl(null)).toBeNull();
    expect(
      parseMonobankJarUrl(
        "https://send.monobank.ua/widget/builder.html?longJarId=4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6",
      ),
    ).toBeNull();
    expect(parseMonobankJarUrl("4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6")).toBeNull();
    expect(parseMonobankJarUrl("https://example.com/jar/9sNTEdMP79")).toBeNull();
  });
});
