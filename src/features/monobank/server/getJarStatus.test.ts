import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  unstable_cache: vi.fn((fn: () => Promise<unknown>) => fn),
}));

vi.stubGlobal("fetch", mocks.fetch);
vi.mock("next/cache", () => ({
  unstable_cache: mocks.unstable_cache,
}));

import { getMonobankJarStatus } from "./getJarStatus";

const LONG_JAR_ID = "2zQL6sqnKgTYi7eVz71YYWKTXTfMK8g";

describe("getMonobankJarStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.unstable_cache.mockImplementation((fn: () => Promise<unknown>) => fn);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null and logs when longJarId is missing", async () => {
    await expect(getMonobankJarStatus(undefined)).resolves.toBeNull();
    await expect(getMonobankJarStatus("")).resolves.toBeNull();
    await expect(getMonobankJarStatus("   ")).resolves.toBeNull();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: monobankLongJarId is missing",
    );
  });

  it("returns null and logs when longJarId is invalid", async () => {
    await expect(getMonobankJarStatus("https://example.org/not-a-jar")).resolves.toBeNull();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: invalid longJarId",
      { longJarId: "https://example.org/not-a-jar" },
    );
  });

  it("returns jar status from the public jar API", async () => {
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        jarId: "AbCdEf123",
        title: "Збір",
        amount: 150_000,
        goal: 500_000,
      }),
    });

    await expect(getMonobankJarStatus(LONG_JAR_ID)).resolves.toEqual({
      title: "Збір",
      balanceUah: 1500,
      goalUah: 5000,
      jarUrl: "https://send.monobank.ua/jar/AbCdEf123",
      sendId: "AbCdEf123",
    });

    expect(mocks.fetch).toHaveBeenCalledWith(
      `https://api.monobank.ua/bank/jar/${LONG_JAR_ID}`,
      expect.objectContaining({
        next: { revalidate: 60 },
      }),
    );
  });

  it("returns null and logs when the public payload is incomplete", async () => {
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ title: "Збір", amount: 100 }),
    });

    await expect(getMonobankJarStatus(LONG_JAR_ID)).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: public jar payload incomplete",
      { longJarId: LONG_JAR_ID },
    );
  });

  it("returns null and logs when Monobank responds with an error", async () => {
    mocks.fetch.mockResolvedValue({ ok: false, status: 404 });

    await expect(getMonobankJarStatus(LONG_JAR_ID)).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Monobank jar status failed",
      expect.objectContaining({ error: "Monobank public jar returned 404" }),
    );
  });
});
