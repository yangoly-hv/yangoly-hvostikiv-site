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
});
