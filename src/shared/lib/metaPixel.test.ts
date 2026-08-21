import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMetaPixelId } from "./metaPixelId";
import {
  reportMetaBrowserEvent,
  trackCompleteRegistration,
  trackContact,
  trackContactClick,
  trackDonate,
  trackDonateConversion,
  trackLead,
  trackMonoDonateClick,
  trackPageViewAndReport,
} from "./metaPixel";

describe("metaPixel", () => {
  const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";
  const storage = new Map<string, string>();
  const fbq = vi.fn();
  const sendBeacon = vi.fn(() => true);

  beforeEach(() => {
    storage.clear();
    fbq.mockReset();
    sendBeacon.mockReset();
    sendBeacon.mockReturnValue(true);
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    vi.stubGlobal("window", {
      fbq,
      location: { href: "https://example.org/uk" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });
    vi.stubGlobal("navigator", { sendBeacon });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reads a trimmed pixel id from env", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "  123456789  ");
    expect(getMetaPixelId()).toBe("123456789");
  });

  it("treats a blank pixel id as disabled", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "  ");
    expect(getMetaPixelId()).toBe("");
  });

  it("does not track when the pixel id is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    trackLead({ eventId: "lead-1" });
    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
    });
    expect(fbq).not.toHaveBeenCalled();
  });

  it("tracks CompleteRegistration with status true", () => {
    trackCompleteRegistration({ eventId: "reg-1" });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "CompleteRegistration",
      { status: true },
      { eventID: "reg-1" },
    );
  });

  it("reports PageView to Pixel and CAPI with a shared event id", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-event-id" });
    trackPageViewAndReport();
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "PageView",
      {},
      { eventID: "pageview-event-id" },
    );
    expect(sendBeacon).toHaveBeenCalledWith(
      "/api/meta/events",
      expect.any(Blob),
    );
  });

  it("retries PageView Pixel until fbq is ready while still beaming CAPI", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-retry-id" });
    vi.stubGlobal("window", {
      location: { href: "https://example.org/uk/tails" },
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
      },
    });

    trackPageViewAndReport();
    expect(fbq).not.toHaveBeenCalled();
    expect(sendBeacon).toHaveBeenCalled();

    vi.stubGlobal("window", {
      fbq,
      location: { href: "https://example.org/uk/tails" },
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
      },
    });

    await vi.advanceTimersByTimeAsync(200);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "PageView",
      {},
      { eventID: "pageview-retry-id" },
    );
  });

  it("tracks Contact and Lead", () => {
    trackContact({ eventId: "contact-1" });
    trackLead({ eventId: "lead-1" });
    expect(fbq).toHaveBeenCalledWith("track", "Contact", {}, { eventID: "contact-1" });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: "lead-1" });
  });

  it("tracks Mono Donate without value or currency", () => {
    trackDonate({ eventId: "mono-1", status: "mono" });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "mono" },
      { eventID: "mono-1" },
    );
  });

  it("tracks Donate once with completed status, value, currency, and eventID", () => {
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
      { status: "completed", value: 500, currency: "UAH" },
      { eventID: orderReference },
    );
  });

  it("no-ops when fbq is unavailable", () => {
    vi.stubGlobal("window", {
      location: { href: "https://example.org/uk" },
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

  it("beacons click events when the pixel id is set", () => {
    reportMetaBrowserEvent({
      eventName: "Donate",
      eventId: "click-1",
      customData: { status: "mono" },
    });
    expect(sendBeacon).toHaveBeenCalledWith(
      "/api/meta/events",
      expect.any(Blob),
    );
  });

  it("does not beacon click events when the pixel id is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    reportMetaBrowserEvent({ eventName: "Contact", eventId: "click-1" });
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("tracks a Mono donate click without value", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "mono-click-id" });
    trackMonoDonateClick();
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "mono" },
      { eventID: "mono-click-id" },
    );
    expect(sendBeacon).toHaveBeenCalled();
  });

  it("does not throw when fbq throws on Lead", () => {
    fbq.mockImplementation(() => {
      throw new Error("fbq failed");
    });
    expect(() => trackLead({ eventId: "lead-1" })).not.toThrow();
  });

  it("still beacons when fbq throws on a click helper", () => {
    fbq.mockImplementation(() => {
      throw new Error("fbq failed");
    });
    expect(() => trackContactClick()).not.toThrow();
    expect(sendBeacon).toHaveBeenCalled();
  });

  it("still tracks Pixel when sendBeacon throws", () => {
    sendBeacon.mockImplementation(() => {
      throw new Error("beacon failed");
    });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "mono-click-id" });

    expect(() => trackMonoDonateClick()).not.toThrow();
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "mono" },
      { eventID: "mono-click-id" },
    );
  });

  it("retries completed Donate until fbq is ready", async () => {
    vi.stubGlobal("window", {
      location: { href: "https://example.org/uk" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });

    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
    });
    expect(fbq).not.toHaveBeenCalled();

    vi.stubGlobal("window", {
      fbq,
      location: { href: "https://example.org/uk" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });

    await vi.advanceTimersByTimeAsync(200);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "completed", value: 500, currency: "UAH" },
      { eventID: orderReference },
    );
  });

  it("gives up quietly if fbq never appears", async () => {
    vi.stubGlobal("window", {
      location: { href: "https://example.org/uk" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
    });

    expect(() =>
      trackDonateConversion({
        orderReference,
        value: 500,
        currency: "UAH",
      }),
    ).not.toThrow();

    await vi.advanceTimersByTimeAsync(2000);
    expect(fbq).not.toHaveBeenCalled();
  });
});
