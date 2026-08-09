import { describe, expect, it } from "vitest";

import { parseLongJarId } from "./parseLongJarId";

describe("parseLongJarId", () => {
  it("accepts a trimmed widget longJarId", () => {
    expect(parseLongJarId("2zQL6sqnKgTYi7eVz71YYWKTXTfMK8g")).toBe(
      "2zQL6sqnKgTYi7eVz71YYWKTXTfMK8g",
    );
    expect(parseLongJarId("  AbCdEf12_34-xy  ")).toBe("AbCdEf12_34-xy");
  });

  it("extracts longJarId from widget builder URLs", () => {
    expect(
      parseLongJarId(
        "https://send.monobank.ua/widget/builder.html?longJarId=4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6&sendId=AU9jJCLcs8",
      ),
    ).toBe("4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6");
  });

  it("extracts long jar param from widget copy links", () => {
    expect(
      parseLongJarId(
        "https://send.monobank.ua/widget/?jar=4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6",
      ),
    ).toBe("4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6");
  });

  it("rejects empty values, share URLs, and unsafe ids", () => {
    expect(parseLongJarId("")).toBeNull();
    expect(parseLongJarId("   ")).toBeNull();
    expect(parseLongJarId("https://api.monobank.ua/bank/jar/abc")).toBeNull();
    expect(parseLongJarId("https://send.monobank.ua/jar/AU9jJCLcs8")).toBeNull();
    expect(parseLongJarId("send.monobank.ua/jar/AbCdEf123")).toBeNull();
    expect(parseLongJarId("short")).toBeNull();
    expect(parseLongJarId("has spaces here ok")).toBeNull();
    expect(parseLongJarId("id/with/slash")).toBeNull();
  });
});
