import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const afterMock = vi.hoisted(() => vi.fn());

vi.mock("next/server", () => ({
  after: (fn: () => void) => afterMock(fn),
}));

import {
  buildMetaCapiPayload,
  getMetaCapiRequestContext,
  hashMetaUserValue,
  normalizeMetaEmail,
  normalizeMetaPhone,
  scheduleMetaCapiEvent,
  sendMetaCapiEvent,
} from "./metaCapi";

describe("metaCapi", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    afterMock.mockReset();
    afterMock.mockImplementation(() => {
      throw new Error("outside request scope");
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "capi-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("normalizes and hashes email and phone", () => {
    expect(normalizeMetaEmail("  A@Example.COM ")).toBe("a@example.com");
    expect(normalizeMetaPhone("+38 (067) 123-45-67")).toBe("380671234567");
    expect(normalizeMetaPhone("0671234567")).toBe("380671234567");
    expect(hashMetaUserValue("a@example.com")).toHaveLength(64);
  });

  it("includes hashed external_id when email and phone are omitted", () => {
    const payload = buildMetaCapiPayload({
      eventName: "Donate",
      eventId: "order-1",
      customData: { status: "completed", value: 500, currency: "UAH" },
      userData: { externalId: "order-1" },
    });

    expect(payload.data[0]).toMatchObject({
      event_name: "Donate",
      user_data: { external_id: [hashMetaUserValue("order-1")] },
    });
    expect(payload.data[0]).not.toHaveProperty("user_data.em");
    expect(payload.data[0]).not.toHaveProperty("user_data.ph");
  });

  it("builds a Graph payload with hashed user data and custom data", () => {
    const payload = buildMetaCapiPayload({
      eventName: "Donate",
      eventId: "order-1",
      eventSourceUrl: "https://example.org/uk",
      customData: { status: "completed", value: 500, currency: "UAH" },
      userData: {
        email: "a@example.com",
        phone: "+38 (067) 123-45-67",
        externalId: "order-1",
        fbp: "fb.1.1",
        clientIpAddress: "203.0.113.10",
        clientUserAgent: "vitest",
      },
    });

    expect(payload.data[0]).toMatchObject({
      event_name: "Donate",
      event_id: "order-1",
      action_source: "website",
      event_source_url: "https://example.org/uk",
      custom_data: { status: "completed", value: 500, currency: "UAH" },
      user_data: {
        em: [hashMetaUserValue("a@example.com")],
        ph: [hashMetaUserValue("380671234567")],
        external_id: [hashMetaUserValue("order-1")],
        fbp: "fb.1.1",
        client_ip_address: "203.0.113.10",
        client_user_agent: "vitest",
      },
    });
  });

  it("reads fbp, fbc, ip and ua from the request", () => {
    const context = getMetaCapiRequestContext(
      new Request("https://example.org/api/meta/events", {
        headers: {
          cookie: "_fbp=fb.1.1710000000000.1234567890; _fbc=fb.1.1710000000000.IwAR0_abc",
          "x-real-ip": "203.0.113.10",
          "user-agent": "vitest",
        },
      }),
    );

    expect(context).toEqual({
      fbp: "fb.1.1710000000000.1234567890",
      fbc: "fb.1.1710000000000.IwAR0_abc",
      clientIpAddress: "203.0.113.10",
      clientUserAgent: "vitest",
    });
  });

  it("prefers a public IPv6 from x-forwarded-for over an IPv4 x-real-ip", () => {
    const context = getMetaCapiRequestContext(
      new Request("https://example.org/api/meta/events", {
        headers: {
          "x-real-ip": "203.0.113.10",
          "x-forwarded-for": "2001:db8::1, 203.0.113.10",
        },
      }),
    );

    expect(context.clientIpAddress).toBe("2001:db8::1");
  });

  it("skips private and loopback addresses when a public IPv4 exists", () => {
    const context = getMetaCapiRequestContext(
      new Request("https://example.org/api/meta/events", {
        headers: {
          "x-forwarded-for": "127.0.0.1, 10.0.0.4, 203.0.113.20",
          "x-real-ip": "192.168.1.9",
        },
      }),
    );

    expect(context.clientIpAddress).toBe("203.0.113.20");
  });

  it("logs Graph failures with the event name", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400 });
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      sendMetaCapiEvent({ eventName: "PageView", eventId: "pageview-1" }),
    ).resolves.toEqual({ skipped: false });

    expect(error).toHaveBeenCalledWith("Meta CAPI request failed", {
      eventName: "PageView",
      status: 400,
    });
    error.mockRestore();
  });

  it("skips Graph when the pixel id is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    await expect(
      sendMetaCapiEvent({ eventName: "Lead", eventId: "lead-1" }),
    ).resolves.toEqual({ skipped: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips Graph when the CAPI token is missing", async () => {
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "");
    await expect(
      sendMetaCapiEvent({ eventName: "Lead", eventId: "lead-1" }),
    ).resolves.toEqual({ skipped: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to Graph when pixel id and token are set", async () => {
    await expect(
      sendMetaCapiEvent({
        eventName: "Lead",
        eventId: "lead-1",
        eventSourceUrl: "https://example.org/uk",
      }),
    ).resolves.toEqual({ skipped: false });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("https://graph.facebook.com/v21.0/123456789/events?");
    expect(url).toContain("access_token=capi-token");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({
      data: [{ event_name: "Lead", event_id: "lead-1" }],
    });
  });

  it("swallows Graph failures", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      sendMetaCapiEvent({ eventName: "Contact", eventId: "contact-1" }),
    ).resolves.toEqual({ skipped: false });

    error.mockRestore();
  });

  it("falls back to sending immediately when after() throws", async () => {
    scheduleMetaCapiEvent({ eventName: "Lead", eventId: "lead-1" });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  it("schedules CAPI through after() when available", async () => {
    const queued: Array<() => unknown> = [];
    afterMock.mockImplementation((fn: () => unknown) => {
      queued.push(fn);
    });

    scheduleMetaCapiEvent({ eventName: "Lead", eventId: "lead-2" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(queued).toHaveLength(1);
    await queued[0]?.();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
