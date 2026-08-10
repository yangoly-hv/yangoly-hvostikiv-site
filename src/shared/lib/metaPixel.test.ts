import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { trackDonateConversion } from "./metaPixel";

describe("trackDonateConversion", () => {
  const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";
  const storage = new Map<string, string>();
  const fbq = vi.fn();

  beforeEach(() => {
    storage.clear();
    fbq.mockReset();
    vi.stubGlobal("window", {
      fbq,
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks Donate once with value, currency, and eventID", () => {
    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
    });
    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
    });

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { value: 500, currency: "UAH" },
      { eventID: orderReference },
    );
  });

  it("no-ops when fbq is unavailable", () => {
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
      },
    });

    expect(() =>
      trackDonateConversion({
        orderReference,
        value: 100,
        currency: "UAH",
      }),
    ).not.toThrow();
  });
});
