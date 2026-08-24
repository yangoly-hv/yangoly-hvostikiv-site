import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMetaCapiEvent: vi.fn(),
  getMetaCapiRequestContext: vi.fn(),
}));

vi.mock("@/shared/lib/metaCapi", () => ({
  sendMetaCapiEvent: mocks.sendMetaCapiEvent,
  getMetaCapiRequestContext: mocks.getMetaCapiRequestContext,
  scheduleMetaCapiEvent: (input: unknown) => {
    void mocks.sendMetaCapiEvent(input);
  },
}));

import { POST } from "./route";
import { resetMetaEventsRateLimitForTests } from "./rateLimit";

const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://example.org/api/meta/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(body),
  });

describe("POST /api/meta/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMetaEventsRateLimitForTests();
    mocks.sendMetaCapiEvent.mockResolvedValue({ skipped: true });
    mocks.getMetaCapiRequestContext.mockReturnValue({
      clientIpAddress: "203.0.113.10",
      clientUserAgent: "vitest",
    });
  });

  it("accepts a Contact click and forwards it to CAPI", async () => {
    const response = await POST(
      request({
        eventName: "Contact",
        eventId: "contact-event-1",
        eventSourceUrl: "https://example.org/uk",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith({
      eventName: "Contact",
      eventId: "contact-event-1",
      eventSourceUrl: "https://example.org/uk",
      customData: undefined,
      userData: {
        clientIpAddress: "203.0.113.10",
        clientUserAgent: "vitest",
      },
    });
  });

  it("accepts a Mono Donate click", async () => {
    const response = await POST(
      request({
        eventName: "Donate",
        eventId: "mono-event-1",
        customData: { status: "mono" },
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "Donate",
        customData: { status: "mono" },
      }),
    );
  });

  it("accepts a PageView and forwards it to CAPI", async () => {
    const response = await POST(
      request({
        eventName: "PageView",
        eventId: "pageview-event-1",
        eventSourceUrl: "https://example.org/uk/tails/zhorik",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith({
      eventName: "PageView",
      eventId: "pageview-event-1",
      eventSourceUrl: "https://example.org/uk/tails/zhorik",
      customData: undefined,
      userData: {
        clientIpAddress: "203.0.113.10",
        clientUserAgent: "vitest",
      },
    });
  });

  it("rejects Donate clicks that are not status mono", async () => {
    const response = await POST(
      request({
        eventName: "Donate",
        eventId: "completed-event-1",
        customData: { status: "completed" },
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.sendMetaCapiEvent).not.toHaveBeenCalled();
  });

  it("rejects unknown event names", async () => {
    const response = await POST(
      request({
        eventName: "Lead",
        eventId: "lead-event-1",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.sendMetaCapiEvent).not.toHaveBeenCalled();
  });

  it("prefers valid body fbp, fbc, and externalId over cookies", async () => {
    const response = await POST(
      request({
        eventName: "PageView",
        eventId: "pageview-event-2",
        eventSourceUrl: "https://example.org/uk",
        fbp: "fb.1.1710000000000.999",
        fbc: "fb.1.1710000000000.IwAR0_body",
        externalId: "visitor-from-body",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith({
      eventName: "PageView",
      eventId: "pageview-event-2",
      eventSourceUrl: "https://example.org/uk",
      customData: undefined,
      userData: {
        clientIpAddress: "203.0.113.10",
        clientUserAgent: "vitest",
        fbp: "fb.1.1710000000000.999",
        fbc: "fb.1.1710000000000.IwAR0_body",
        externalId: "visitor-from-body",
      },
    });
  });

  it("ignores invalid click ids and does not forward email or phone", async () => {
    const response = await POST(
      request({
        eventName: "Contact",
        eventId: "contact-event-2",
        fbp: "fb.1.1",
        fbc: "nope",
        externalId: "short",
        email: "leak@example.org",
        phone: "+380671234567",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith({
      eventName: "Contact",
      eventId: "contact-event-2",
      eventSourceUrl: undefined,
      customData: undefined,
      userData: {
        clientIpAddress: "203.0.113.10",
        clientUserAgent: "vitest",
      },
    });
  });

  it("returns 429 with Retry-After when the app rate limit is exceeded", async () => {
    for (let index = 0; index < 120; index += 1) {
      expect(
        (
          await POST(
            request({
              eventName: "PageView",
              eventId: `pageview-limit-${index.toString().padStart(3, "0")}`,
            }),
          )
        ).status,
      ).toBe(200);
    }

    const limited = await POST(
      request({
        eventName: "PageView",
        eventId: "pageview-limit-overflow",
      }),
    );

    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toEqual(expect.any(String));
    await expect(limited.json()).resolves.toEqual({
      success: false,
      error: "RATE_LIMITED",
    });
  });
});
