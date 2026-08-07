import { describe, expect, it } from "vitest";

import { findJarBySendId, minorToUah, toJarStatus } from "./jarStatus";
import type { MonobankJar } from "./types";

const jar: MonobankJar = {
  id: "jar-internal-id",
  sendId: "AbCdEf123",
  title: "Збір серпень",
  currencyCode: 980,
  balance: 400_000,
  goal: 20_000_000,
};

describe("monobank jar status helpers", () => {
  it("converts kopiyky to UAH", () => {
    expect(minorToUah(400_000)).toBe(4000);
    expect(minorToUah(0)).toBe(0);
  });

  it("finds a jar by sendId", () => {
    expect(findJarBySendId({ jars: [jar] }, "AbCdEf123")).toEqual(jar);
    expect(findJarBySendId({ jars: [jar] }, "missing")).toBeNull();
    expect(findJarBySendId({}, "AbCdEf123")).toBeNull();
  });

  it("maps API jar fields to display status", () => {
    expect(toJarStatus(jar, "https://send.monobank.ua/jar/AbCdEf123", "AbCdEf123")).toEqual({
      title: "Збір серпень",
      balanceUah: 4000,
      goalUah: 200_000,
      jarUrl: "https://send.monobank.ua/jar/AbCdEf123",
      sendId: "AbCdEf123",
    });
  });

  it("allows jars without a goal", () => {
    const withoutGoal = { ...jar, goal: undefined };
    expect(toJarStatus(withoutGoal, "https://send.monobank.ua/jar/AbCdEf123", "AbCdEf123").goalUah).toBeNull();
  });
});
