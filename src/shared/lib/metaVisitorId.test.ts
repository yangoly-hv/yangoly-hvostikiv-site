import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMetaExternalId, META_EXTERNAL_ID_STORAGE_KEY } from "./metaVisitorId";

describe("getMetaExternalId", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("crypto", { randomUUID: () => "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" });
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates and persists a UUID in localStorage", () => {
    expect(getMetaExternalId()).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(store.get(META_EXTERNAL_ID_STORAGE_KEY)).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    );
  });

  it("reuses the stored id on later calls", () => {
    store.set(META_EXTERNAL_ID_STORAGE_KEY, "stored-visitor-id");
    expect(getMetaExternalId()).toBe("stored-visitor-id");
    expect(getMetaExternalId()).toBe("stored-visitor-id");
  });

  it("falls back to an in-memory id when localStorage throws", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
    });

    expect(getMetaExternalId()).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    vi.stubGlobal("crypto", { randomUUID: () => "should-not-replace" });
    expect(getMetaExternalId()).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
  });

  it("ignores a stored value that fails the external id format", () => {
    store.set(META_EXTERNAL_ID_STORAGE_KEY, "bad");
    expect(getMetaExternalId()).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
  });
});
