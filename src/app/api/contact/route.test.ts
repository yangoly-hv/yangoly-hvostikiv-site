import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  sendEmail: vi.fn(),
  sendMetaCapiEvent: vi.fn(),
  getMetaCapiRequestContext: vi.fn(),
}));

vi.mock("./rateLimit", () => ({
  checkContactRequestRateLimit: mocks.checkRateLimit,
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.sendEmail };
  },
}));

vi.mock("@/shared/lib/metaCapi", () => ({
  sendMetaCapiEvent: mocks.sendMetaCapiEvent,
  getMetaCapiRequestContext: mocks.getMetaCapiRequestContext,
  scheduleMetaCapiEvent: (input: unknown) => {
    void mocks.sendMetaCapiEvent(input);
  },
}));

import { POST } from "./route";

const validBody = {
  name: "Марія",
  phone: "+38 (067) 123-45-67",
  message: "Допоможіть <тест>",
  website: "",
  source: "contact-page",
};

const request = (body: unknown) =>
  new Request("https://example.org/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "resend-key";
    mocks.checkRateLimit.mockResolvedValue({
      limited: false,
      retryAfterSeconds: 600,
    });
    mocks.sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
    mocks.sendMetaCapiEvent.mockResolvedValue({ skipped: true });
    mocks.getMetaCapiRequestContext.mockReturnValue({
      clientIpAddress: "203.0.113.10",
    });
  });

  it("returns 429 with Retry-After when the limiter blocks the request", async () => {
    mocks.checkRateLimit.mockResolvedValue({
      limited: true,
      retryAfterSeconds: 420,
    });

    const response = await POST(request(validBody));

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("420");
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("fails closed when the limiter throws an unexpected error", async () => {
    mocks.checkRateLimit.mockRejectedValue(new Error("Redis unavailable"));

    const response = await POST(request(validBody));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: "RATE_LIMIT_UNAVAILABLE",
    });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects oversized request bodies before sending email", async () => {
    const response = await POST(
      request({ ...validBody, message: "x".repeat(9 * 1024) }),
    );

    expect(response.status).toBe(413);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("escapes user-controlled HTML in the email body", async () => {
    const response = await POST(request(validBody));

    expect(response.status).toBe(200);
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Допоможіть &lt;тест&gt;"),
      }),
    );
  });

  it.each([
    ["contact-page", "Зворотній зв'язок"],
    ["partnership", "Партнерство"],
    ["volunteering", "Волонтерство"],
    ["event-partnership", "Партнерство"],
    ["event-ambassador", "Амбасадорство"],
    ["event-volunteering", "Волонтерство"],
  ])("identifies %s requests as %s in the email", async (source, label) => {
    const response = await POST(request({ ...validBody, source }));

    expect(response.status).toBe(200);
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: `Новий лист з сайту — ${label}`,
        html: expect.stringContaining(`<b>Тип звернення:</b> ${label}`),
        text: expect.stringContaining(`Тип звернення: ${label}`),
      }),
    );
  });

  it("rejects requests with an unknown source", async () => {
    const response = await POST(request({ ...validBody, source: "contact-cta" }));

    expect(response.status).toBe(400);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("returns eventId even when CAPI is skipped after a real success", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "Lead",
        eventId: body.eventId,
        userData: expect.objectContaining({ phone: validBody.phone }),
      }),
    );
  });

  it("does not track honeypot submissions", async () => {
    const response = await POST(request({ ...validBody, website: "https://spam.test" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(body.eventId).toBeUndefined();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.sendMetaCapiEvent).not.toHaveBeenCalled();
  });
});
