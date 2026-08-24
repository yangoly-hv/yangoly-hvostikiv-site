import { afterEach, describe, expect, it, vi } from "vitest";

import { getGtmId } from "./gtmId";

describe("getGtmId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads a trimmed GTM id from env", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "  GTM-WBPJHKNF  ");
    expect(getGtmId()).toBe("GTM-WBPJHKNF");
  });

  it("accepts the production container id", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-WBPJHKNF");
    expect(getGtmId()).toBe("GTM-WBPJHKNF");
  });

  it("treats a blank id as disabled", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "  ");
    expect(getGtmId()).toBe("");
  });

  it("treats an unset id as disabled", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "");
    expect(getGtmId()).toBe("");
  });

  it("rejects ids that are not GTM containers", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "G-ABC123");
    expect(getGtmId()).toBe("");
  });

  it("rejects ids with extra characters", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-WBPJHKNF';alert(1)//");
    expect(getGtmId()).toBe("");
  });
});
