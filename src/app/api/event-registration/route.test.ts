import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  appendRegistrationRow: vi.fn(),
  sendMetaCapiEvent: vi.fn(),
  getMetaCapiRequestContext: vi.fn(),
  SheetsUnavailableError: class SheetsUnavailableError extends Error {
    constructor() {
      super("SHEETS_UNAVAILABLE");
      this.name = "SheetsUnavailableError";
    }
  },
  SheetsAppendError: class SheetsAppendError extends Error {
    constructor() {
      super("SHEETS_APPEND_FAILED");
      this.name = "SheetsAppendError";
    }
  },
}));

const validBody = {
  fullName: "Марія Коваленко",
  email: "maria@example.com",
  phone: "+38 (067) 123-45-67",
  petType: "dog",
  petName: "Рекс",
  comments: "Тест",
  website: "",
  locale: "uk",
};

const request = (body: unknown) =>
  new Request("https://example.org/api/event-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });

describe("POST /api/event-registration", () => {
  let POST: (request: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.checkRateLimit.mockResolvedValue({
      limited: false,
      retryAfterSeconds: 600,
    });
    mocks.appendRegistrationRow.mockResolvedValue(undefined);
    mocks.sendMetaCapiEvent.mockResolvedValue({ skipped: true });
    mocks.getMetaCapiRequestContext.mockReturnValue({
      clientIpAddress: "203.0.113.10",
    });

    vi.doMock("./rateLimit", () => ({
      checkEventRegistrationRateLimit: mocks.checkRateLimit,
    }));
    vi.doMock("@/features/event-registration/server/appendRegistrationRow", () => ({
      appendRegistrationRow: mocks.appendRegistrationRow,
      SheetsUnavailableError: mocks.SheetsUnavailableError,
      SheetsAppendError: mocks.SheetsAppendError,
    }));
    vi.doMock("@/shared/lib/metaCapi", () => ({
      sendMetaCapiEvent: mocks.sendMetaCapiEvent,
      getMetaCapiRequestContext: mocks.getMetaCapiRequestContext,
      scheduleMetaCapiEvent: (input: unknown) => {
        void mocks.sendMetaCapiEvent(input);
      },
    }));

    ({ POST } = await import("./route"));
  });

  it("returns 429 with Retry-After when the limiter blocks the request", async () => {
    mocks.checkRateLimit.mockResolvedValue({
      limited: true,
      retryAfterSeconds: 420,
    });

    const response = await POST(request(validBody));

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("420");
    expect(mocks.appendRegistrationRow).not.toHaveBeenCalled();
  });

  it("fails closed when the limiter throws", async () => {
    mocks.checkRateLimit.mockRejectedValue(new Error("unavailable"));

    const response = await POST(request(validBody));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: "RATE_LIMIT_UNAVAILABLE",
    });
  });

  it("rejects oversized request bodies", async () => {
    const response = await POST(
      request({ ...validBody, comments: "x".repeat(9 * 1024) }),
    );

    expect(response.status).toBe(413);
    expect(mocks.appendRegistrationRow).not.toHaveBeenCalled();
  });

  it("returns success without writing when honeypot is filled", async () => {
    const response = await POST(
      request({ ...validBody, website: "bot.example" }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(body.eventId).toBeUndefined();
    expect(mocks.appendRegistrationRow).not.toHaveBeenCalled();
    expect(mocks.sendMetaCapiEvent).not.toHaveBeenCalled();
  });

  it("rejects invalid input", async () => {
    const response = await POST(request({ ...validBody, email: "bad" }));

    expect(response.status).toBe(400);
    expect(mocks.appendRegistrationRow).not.toHaveBeenCalled();
  });

  it("returns 503 when Sheets credentials are missing", async () => {
    mocks.appendRegistrationRow.mockRejectedValue(
      new mocks.SheetsUnavailableError(),
    );

    const response = await POST(request(validBody));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: "SHEETS_UNAVAILABLE",
    });
  });

  it("appends a valid registration row", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.org");
    const response = await POST(request(validBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.eventId).toEqual(expect.any(String));
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "CompleteRegistration",
        eventId: body.eventId,
        eventSourceUrl: "https://example.org/uk/event-registration",
        customData: { status: true },
        userData: expect.objectContaining({
          email: "maria@example.com",
          phone: "+38 (067) 123-45-67",
        }),
      }),
    );
    expect(mocks.appendRegistrationRow).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "Марія Коваленко",
        email: "maria@example.com",
        petType: "dog",
        locale: "uk",
      }),
    );
  });

  it("prefers referer over the CompleteRegistration fallback URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.org");
    const response = await POST(
      new Request("https://example.org/api/event-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "203.0.113.10",
          referer: "https://example.org/uk/event-registration?utm=test",
        },
        body: JSON.stringify(validBody),
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendMetaCapiEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "CompleteRegistration",
        eventSourceUrl: "https://example.org/uk/event-registration?utm=test",
      }),
    );
  });
});
