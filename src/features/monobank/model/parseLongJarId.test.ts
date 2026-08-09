import { describe, expect, it } from "vitest";

import { parseLongJarId } from "./parseLongJarId";

describe("parseLongJarId", () => {
  it("accepts a trimmed widget longJarId", () => {
    expect(parseLongJarId("2zQL6sqnKgTYi7eVz71YYWKTXTfMK8g")).toBe(
      "2zQL6sqnKgTYi7eVz71YYWKTXTfMK8g",
    );
    expect(parseLongJarId("  AbCdEf12_34-xy  ")).toBe("AbCdEf12_34-xy");
  });

  it("rejects empty values, URLs, and unsafe ids", () => {
    expect(parseLongJarId("")).toBeNull();
    expect(parseLongJarId("   ")).toBeNull();
    expect(parseLongJarId("https://api.monobank.ua/bank/jar/abc")).toBeNull();
    expect(parseLongJarId("send.monobank.ua/jar/AbCdEf123")).toBeNull();
    expect(parseLongJarId("short")).toBeNull();
    expect(parseLongJarId("has spaces here ok")).toBeNull();
    expect(parseLongJarId("id/with/slash")).toBeNull();
  });
});
