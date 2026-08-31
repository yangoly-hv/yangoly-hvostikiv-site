import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { META_EXTERNAL_ID_STORAGE_KEY } from "./metaVisitorId";
import { getMetaPixelId } from "./metaPixelId";
import {
  FBQ_RETRY_ATTEMPTS,
  FBQ_RETRY_MS,
  reportMetaBrowserEvent,
  trackCompleteRegistration,
  trackContact,
  trackContactClick,
  trackDonate,
  trackDonateConversion,
  trackDonatePaymentStartedClick,
  trackDonateStartedClick,
  trackLead,
  trackMonoDonateClick,
  trackPageViewAndReport,
  trackStartPartnershipClick,
} from "./metaPixel";

const parseFetchBody = (call: unknown[]) =>
  JSON.parse(String((call[1] as { body: string }).body)) as Record<string, unknown>;

const fbqRetryBudgetMs = FBQ_RETRY_MS * FBQ_RETRY_ATTEMPTS;

describe("metaPixel", () => {
  const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";
  const storage = new Map<string, string>();
  const localStore = new Map<string, string>();
  const fbq = vi.fn();
  const sendBeacon = vi.fn(() => true);
  const fetchMock = vi.fn();

  const stubWindow = (withFbq = true) => {
    vi.stubGlobal("window", {
      ...(withFbq ? { fbq } : {}),
      location: { href: "https://example.org/uk" },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
      },
      localStorage: {
        getItem: (key: string) => localStore.get(key) ?? null,
        setItem: (key: string, value: string) => {
          localStore.set(key, value);
        },
      },
    });
  };

  beforeEach(() => {
    storage.clear();
    localStore.clear();
    localStore.set(META_EXTERNAL_ID_STORAGE_KEY, "visitor-test-id");
    fbq.mockReset();
    sendBeacon.mockReset();
    sendBeacon.mockReturnValue(true);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => null },
    });
    vi.useFakeTimers();
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    stubWindow();
    vi.stubGlobal("document", { cookie: "" });
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("fetch", fetchMock);
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

  it("inits Pixel with advanced matching then tracks CompleteRegistration", () => {
    trackCompleteRegistration({
      eventId: "reg-1",
      email: "a@example.com",
      phone: "+38 (067) 123-45-67",
    });
    expect(fbq).toHaveBeenCalledWith("init", "123456789", {
      em: "a@example.com",
      ph: "+38 (067) 123-45-67",
      external_id: "visitor-test-id",
    });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "CompleteRegistration",
      { status: true },
      { eventID: "reg-1" },
    );
  });

  it("reports PageView to Pixel then CAPI with a shared event id and visitor id", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-event-id" });
    vi.stubGlobal("document", {
      cookie: "_fbp=fb.1.1710000000000.1234567890",
    });
    trackPageViewAndReport();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fbq).toHaveBeenCalledWith("init", "123456789", {
      external_id: "visitor-test-id",
    });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "PageView",
      {},
      { eventID: "pageview-event-id" },
    );
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "PageView",
      eventId: "pageview-event-id",
      eventSourceUrl: "https://example.org/uk",
      fbp: "fb.1.1710000000000.1234567890",
      externalId: "visitor-test-id",
    });
  });

  it("retries PageView Pixel before beaming CAPI", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-retry-id" });
    stubWindow(false);

    trackPageViewAndReport();
    expect(fbq).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    stubWindow(true);
    await vi.advanceTimersByTimeAsync(200);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "PageView",
      {},
      { eventID: "pageview-retry-id" },
    );
  });

  it("still beacons PageView CAPI if fbq never appears", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-blocked-id" });
    stubWindow(false);

    trackPageViewAndReport();
    await vi.advanceTimersByTimeAsync(fbqRetryBudgetMs);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fbq).not.toHaveBeenCalled();
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "PageView",
      eventId: "pageview-blocked-id",
    });
  });

  it("retries PageView CAPI once after a 429", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: (name: string) => (name === "Retry-After" ? "1" : null) },
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
      });
    vi.stubGlobal("crypto", { randomUUID: () => "pageview-retry-429" });

    trackPageViewAndReport();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("tracks Contact and Lead", async () => {
    trackContact({ eventId: "contact-1" });
    trackLead({ eventId: "lead-1", phone: "+380671234567" });
    expect(fbq).toHaveBeenCalledWith("track", "Contact", {}, { eventID: "contact-1" });
    expect(fbq).toHaveBeenCalledWith("init", "123456789", {
      ph: "+380671234567",
      external_id: "visitor-test-id",
    });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: "lead-1" });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "Lead",
      eventId: "lead-1",
      externalId: "visitor-test-id",
    });
  });

  it("retries Pixel Lead until fbq is ready and still posts CAPI", async () => {
    stubWindow(false);

    trackLead({ eventId: "lead-retry-1", phone: "+380671234567" });
    expect(fbq).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "Lead",
      eventId: "lead-retry-1",
    });

    stubWindow(true);
    await vi.advanceTimersByTimeAsync(200);
    expect(fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: "lead-retry-1" });
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

  it("tracks Donate started and payment started funnel clicks", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "donate-started-id" });
    trackDonateStartedClick({ purpose: "tail-one-time", name: "Zhorik" });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "started", purpose: "tail-one-time", name: "Zhorik" },
      { eventID: "donate-started-id" },
    );

    vi.stubGlobal("crypto", { randomUUID: () => "donate-payment-id" });
    trackDonatePaymentStartedClick({
      purpose: "tail-one-time",
      name: "Zhorik",
      donorName: "Anatoliy",
      value: 500,
      currency: "UAH",
      schedule: "oneTime",
    });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      {
        status: "payment_started",
        purpose: "tail-one-time",
        name: "Zhorik",
        donorName: "Anatoliy",
        value: 500,
        currency: "UAH",
        schedule: "oneTime",
      },
      { eventID: "donate-payment-id" },
    );
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(parseFetchBody(fetchMock.mock.calls.at(-1) as unknown[])).toMatchObject({
      eventName: "Donate",
      eventId: "donate-payment-id",
      customData: {
        status: "payment_started",
        purpose: "tail-one-time",
        name: "Zhorik",
        donorName: "Anatoliy",
        value: 500,
        currency: "UAH",
        schedule: "oneTime",
      },
    });
  });

  it("tracks Donate once with completed status, value, currency, purpose, name, and eventID", () => {
    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
      purpose: "tail-one-time",
      name: "Zhorik",
    });
    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
      purpose: "tail-one-time",
      name: "Zhorik",
    });

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      {
        status: "completed",
        value: 500,
        currency: "UAH",
        purpose: "tail-one-time",
        name: "Zhorik",
      },
      { eventID: orderReference },
    );
  });

  it("no-ops when fbq is unavailable", () => {
    stubWindow(false);

    expect(() =>
      trackDonateConversion({
        orderReference,
        value: 100,
        currency: "UAH",
      }),
    ).not.toThrow();
  });

  it("posts click events when the pixel id is set", async () => {
    reportMetaBrowserEvent({
      eventName: "Donate",
      eventId: "click-1",
      customData: { status: "mono" },
    });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "Donate",
      eventId: "click-1",
      customData: { status: "mono" },
      externalId: "visitor-test-id",
    });
  });

  it("does not post click events when the pixel id is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    reportMetaBrowserEvent({ eventName: "Contact", eventId: "click-1" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("tracks a Mono donate click without value", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "mono-click-id" });
    trackMonoDonateClick();
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "mono" },
      { eventID: "mono-click-id" },
    );
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it("tracks StartPartnership as a custom Pixel event and posts CAPI", async () => {
    vi.stubGlobal("crypto", { randomUUID: () => "start-partnership-id" });
    trackStartPartnershipClick();
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "StartPartnership",
      {},
      { eventID: "start-partnership-id" },
    );
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(parseFetchBody(fetchMock.mock.calls[0] as unknown[])).toMatchObject({
      eventName: "StartPartnership",
      eventId: "start-partnership-id",
      externalId: "visitor-test-id",
    });
  });

  it("does not throw when fbq throws on Lead", () => {
    fbq.mockImplementation(() => {
      throw new Error("fbq failed");
    });
    expect(() => trackLead({ eventId: "lead-1" })).not.toThrow();
  });

  it("still posts when fbq throws on a click helper", async () => {
    fbq.mockImplementation(() => {
      throw new Error("fbq failed");
    });
    expect(() => trackContactClick()).not.toThrow();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it("still tracks Pixel when fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    vi.stubGlobal("crypto", { randomUUID: () => "mono-click-id" });

    expect(() => trackMonoDonateClick()).not.toThrow();
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "mono" },
      { eventID: "mono-click-id" },
    );
    await vi.waitFor(() => expect(sendBeacon).toHaveBeenCalled());
  });

  it("retries completed Donate until fbq is ready", async () => {
    stubWindow(false);

    trackDonateConversion({
      orderReference,
      value: 500,
      currency: "UAH",
    });
    expect(fbq).not.toHaveBeenCalled();

    stubWindow(true);
    await vi.advanceTimersByTimeAsync(200);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Donate",
      { status: "completed", value: 500, currency: "UAH" },
      { eventID: orderReference },
    );
  });

  it("gives up quietly if fbq never appears", async () => {
    stubWindow(false);

    expect(() =>
      trackDonateConversion({
        orderReference,
        value: 500,
        currency: "UAH",
      }),
    ).not.toThrow();

    await vi.advanceTimersByTimeAsync(fbqRetryBudgetMs);
    expect(fbq).not.toHaveBeenCalled();
  });
});
