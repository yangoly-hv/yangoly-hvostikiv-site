import { describe, expect, it } from "vitest";

import { minorToUah, toJarStatusFromPublic } from "./jarStatus";
import type { MonobankPublicJar } from "./types";

const jar: MonobankPublicJar = {
  jarId: "AbCdEf123",
  title: "Збір серпень",
  amount: 400_000,
  goal: 20_000_000,
};

describe("monobank jar status helpers", () => {
  it("converts kopiyky to UAH", () => {
    expect(minorToUah(400_000)).toBe(4000);
    expect(minorToUah(0)).toBe(0);
  });

  it("maps public API jar fields to display status", () => {
    expect(toJarStatusFromPublic(jar)).toEqual({
      title: "Збір серпень",
      balanceUah: 4000,
      goalUah: 200_000,
      jarUrl: "https://send.monobank.ua/jar/AbCdEf123",
      sendId: "AbCdEf123",
    });
  });

  it("allows jars without a goal", () => {
    const withoutGoal = { ...jar, goal: undefined };
    expect(toJarStatusFromPublic(withoutGoal)?.goalUah).toBeNull();
  });

  it("returns null when jarId or title is missing", () => {
    expect(toJarStatusFromPublic({ ...jar, jarId: "" })).toBeNull();
    expect(toJarStatusFromPublic({ ...jar, title: "  " })).toBeNull();
    expect(toJarStatusFromPublic({ ...jar, amount: Number.NaN })).toBeNull();
  });
});
