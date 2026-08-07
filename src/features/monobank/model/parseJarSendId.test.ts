import { describe, expect, it } from "vitest";

import { parseJarSendId } from "./parseJarSendId";

describe("parseJarSendId", () => {
  it("parses /jar/{sendId} URLs", () => {
    expect(parseJarSendId("https://send.monobank.ua/jar/AbCdEf123")).toBe("AbCdEf123");
    expect(parseJarSendId("https://www.send.monobank.ua/jar/AbCdEf123")).toBe("AbCdEf123");
  });

  it("parses short /{sendId} URLs", () => {
    expect(parseJarSendId("https://send.monobank.ua/AbCdEf123")).toBe("AbCdEf123");
  });

  it("accepts URLs without a scheme", () => {
    expect(parseJarSendId("send.monobank.ua/jar/AbCdEf123")).toBe("AbCdEf123");
  });

  it("trims whitespace", () => {
    expect(parseJarSendId("  https://send.monobank.ua/jar/AbCdEf123  ")).toBe("AbCdEf123");
  });

  it("rejects empty or invalid values", () => {
    expect(parseJarSendId("")).toBeNull();
    expect(parseJarSendId("https://example.org/jar/AbCdEf123")).toBeNull();
    expect(parseJarSendId("https://send.monobank.ua/")).toBeNull();
    expect(parseJarSendId("https://send.monobank.ua/jar/")).toBeNull();
    expect(parseJarSendId("https://send.monobank.ua/jar/a/b")).toBeNull();
    expect(parseJarSendId("not a url")).toBeNull();
  });
});
