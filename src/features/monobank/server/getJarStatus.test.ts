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

describe("getMonobankJarStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.unstable_cache.mockImplementation((fn: () => Promise<unknown>) => fn);
    process.env.MONOBANK_TOKEN = "mono-token";
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    delete process.env.MONOBANK_TOKEN;
    vi.restoreAllMocks();
  });

  it("returns null and logs when the jar URL is missing", async () => {
    await expect(getMonobankJarStatus(undefined)).resolves.toBeNull();
    await expect(getMonobankJarStatus("")).resolves.toBeNull();
    await expect(getMonobankJarStatus("   ")).resolves.toBeNull();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: monobankJarUrl is missing",
    );
  });

  it("returns null and logs when the token is missing", async () => {
    delete process.env.MONOBANK_TOKEN;

    await expect(getMonobankJarStatus("https://send.monobank.ua/jar/AbCdEf123")).resolves.toBeNull();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: MONOBANK_TOKEN is not configured",
    );
  });

  it("returns null and logs when the jar URL is invalid", async () => {
    await expect(getMonobankJarStatus("https://example.org/not-a-jar")).resolves.toBeNull();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: invalid jar URL",
      { jarUrl: "https://example.org/not-a-jar" },
    );
  });

  it("returns jar status when Monobank lists the jar", async () => {
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        jars: [
          {
            id: "internal",
            sendId: "AbCdEf123",
            title: "Збір",
            currencyCode: 980,
            balance: 150_000,
            goal: 500_000,
          },
        ],
      }),
    });

    await expect(getMonobankJarStatus("https://send.monobank.ua/jar/AbCdEf123")).resolves.toEqual({
      title: "Збір",
      balanceUah: 1500,
      goalUah: 5000,
      jarUrl: "https://send.monobank.ua/jar/AbCdEf123",
      sendId: "AbCdEf123",
    });

    expect(mocks.fetch).toHaveBeenCalledWith(
      "https://api.monobank.ua/personal/client-info",
      expect.objectContaining({
        headers: { "X-Token": "mono-token" },
      }),
    );
  });

  it("returns null and logs when the jar is missing from client-info", async () => {
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ jars: [] }),
    });

    await expect(getMonobankJarStatus("https://send.monobank.ua/jar/AbCdEf123")).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      "Monobank jar status skipped: jar not found in client-info",
      { sendId: "AbCdEf123" },
    );
  });

  it("returns null and logs when Monobank responds with an error", async () => {
    mocks.fetch.mockResolvedValue({ ok: false, status: 429 });

    await expect(getMonobankJarStatus("https://send.monobank.ua/jar/AbCdEf123")).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "Monobank jar status failed",
      expect.objectContaining({ error: "Monobank client-info returned 429" }),
    );
  });
});
