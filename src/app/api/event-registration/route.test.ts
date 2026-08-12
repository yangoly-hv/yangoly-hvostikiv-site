import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  appendRegistrationRow: vi.fn(),
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

    vi.doMock("./rateLimit", () => ({
      checkEventRegistrationRateLimit: mocks.checkRateLimit,
    }));
    vi.doMock("@/features/event-registration/server/appendRegistrationRow", () => ({
      appendRegistrationRow: mocks.appendRegistrationRow,
      SheetsUnavailableError: mocks.SheetsUnavailableError,
      SheetsAppendError: mocks.SheetsAppendError,
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

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.appendRegistrationRow).not.toHaveBeenCalled();
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
    const response = await POST(request(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.appendRegistrationRow).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "Марія Коваленко",
        email: "maria@example.com",
        petType: "dog",
        locale: "uk",
      }),
    );
  });
});
