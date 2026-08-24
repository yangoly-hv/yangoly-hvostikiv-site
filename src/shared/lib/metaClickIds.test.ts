import { describe, expect, it } from "vitest";

import {
  getMetaClickIds,
  isValidMetaExternalId,
  isValidMetaFbc,
  isValidMetaFbp,
} from "./metaClickIds";

describe("meta click id formats", () => {
  it("accepts Meta fbp, fbc, and external id shapes", () => {
    expect(isValidMetaFbp("fb.1.1710000000000.1234567890")).toBe(true);
    expect(isValidMetaFbc("fb.1.1710000000000.IwAR0_abc-123")).toBe(true);
    expect(isValidMetaExternalId("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")).toBe(true);
  });

  it("rejects malformed identifiers", () => {
    expect(isValidMetaFbp("fb.1.1")).toBe(false);
    expect(isValidMetaFbc("fb.1.2")).toBe(false);
    expect(isValidMetaExternalId("short")).toBe(false);
    expect(isValidMetaExternalId("has spaces!!")).toBe(false);
  });
});

describe("getMetaClickIds", () => {
  it("reads valid _fbp and _fbc cookies", () => {
    expect(
      getMetaClickIds({
        cookieHeader: "_fbp=fb.1.1710000000000.1234567890; _fbc=fb.1.1710000000000.IwAR0_abc",
        href: "https://example.org/uk",
      }),
    ).toEqual({
      fbp: "fb.1.1710000000000.1234567890",
      fbc: "fb.1.1710000000000.IwAR0_abc",
    });
  });

  it("builds fbc from fbclid when the cookie is missing", () => {
    expect(
      getMetaClickIds({
        cookieHeader: "_fbp=fb.1.1710000000000.1234567890",
        href: "https://example.org/uk?fbclid=IwAR0_from-url",
        now: 1_710_000_000_000,
      }),
    ).toEqual({
      fbp: "fb.1.1710000000000.1234567890",
      fbc: "fb.1.1710000000000.IwAR0_from-url",
    });
  });

  it("prefers the _fbc cookie over fbclid", () => {
    expect(
      getMetaClickIds({
        cookieHeader: "_fbc=fb.1.1710000000000.CookieClick",
        href: "https://example.org/uk?fbclid=IwAR0_from-url",
        now: 1,
      }),
    ).toEqual({
      fbp: undefined,
      fbc: "fb.1.1710000000000.CookieClick",
    });
  });

  it("drops invalid cookie values", () => {
    expect(
      getMetaClickIds({
        cookieHeader: "_fbp=fb.1.1; _fbc=nope",
        href: "https://example.org/uk",
      }),
    ).toEqual({ fbp: undefined, fbc: undefined });
  });
});
