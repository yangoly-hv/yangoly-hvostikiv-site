import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
}));

vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({ fetch: mocks.fetch }),
}));

import { GET } from "./route";

const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";

describe("GET /api/wayforpay/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns approved status with donation value for conversion tracking", async () => {
    mocks.fetch.mockResolvedValue({
      paymentStatus: "approved",
      amountMinor: 50_000,
      currency: "UAH",
    });

    const response = await GET(
      new Request(`https://example.org/api/wayforpay/status?orderReference=${orderReference}`),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      status: "approved",
      value: 500,
      currency: "UAH",
    });
  });

  it("returns status without value fields for non-approved payments", async () => {
    mocks.fetch.mockResolvedValue({
      paymentStatus: "pending",
      amountMinor: 50_000,
      currency: "UAH",
    });

    const response = await GET(
      new Request(`https://example.org/api/wayforpay/status?orderReference=${orderReference}`),
    );

    await expect(response.json()).resolves.toEqual({ status: "pending" });
  });

  it("does not expose statuses for invalid or unknown orders", async () => {
    const invalid = await GET(new Request("https://example.org/api/wayforpay/status?orderReference=guessable"));
    expect(invalid.status).toBe(400);

    mocks.fetch.mockResolvedValue(null);
    const missing = await GET(
      new Request(`https://example.org/api/wayforpay/status?orderReference=${orderReference}`),
    );
    expect(missing.status).toBe(404);
  });

  it("returns unknown for malformed stored status instead of treating it as approved", async () => {
    mocks.fetch.mockResolvedValue({ paymentStatus: "Unexpected" });

    const response = await GET(
      new Request(`https://example.org/api/wayforpay/status?orderReference=${orderReference}`),
    );

    await expect(response.json()).resolves.toEqual({ status: "unknown" });
  });
});
