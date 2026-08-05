import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getRequiredEnv: vi.fn(),
  paymentsFetch: vi.fn(),
  legacyFetch: vi.fn(),
  legacyDelete: vi.fn(),
}));

vi.mock("@/shared/lib/env.server", () => ({ getRequiredEnv: mocks.getRequiredEnv }));
vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({ fetch: mocks.paymentsFetch }),
}));
vi.mock("@/shared/lib/sanity", () => ({
  default: { fetch: mocks.legacyFetch, delete: mocks.legacyDelete },
}));

import { POST } from "./route";

const orderReference = "DONATE_123e4567-e89b-12d3-a456-426614174000";

describe("POST /api/wayforpay/return", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequiredEnv.mockReturnValue("https://example.org");
    mocks.paymentsFetch.mockResolvedValue({ _id: "payment-order", returnPath: "/uk/fundraising" });
  });

  it("keeps the payment order available and waits for callback confirmation", async () => {
    const formData = new FormData();
    formData.set("orderReference", orderReference);

    const response = await POST(
      new Request("https://example.org/api/wayforpay/return", { method: "POST", body: formData }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      `https://example.org/uk/fundraising?payment=processing&orderReference=${orderReference}`,
    );
    expect(mocks.legacyDelete).not.toHaveBeenCalled();
  });

  it("does not redirect to an external return path", async () => {
    mocks.paymentsFetch.mockResolvedValue({ _id: "payment-order", returnPath: "//attacker.example" });
    const formData = new FormData();
    formData.set("orderReference", orderReference);

    const response = await POST(
      new Request("https://example.org/api/wayforpay/return", { method: "POST", body: formData }),
    );

    expect(response.headers.get("location")).toBe(
      `https://example.org/?payment=processing&orderReference=${orderReference}`,
    );
  });

  it("does not start payment confirmation for an unknown order", async () => {
    mocks.paymentsFetch.mockResolvedValue(null);
    mocks.legacyFetch.mockResolvedValue(null);
    const formData = new FormData();
    formData.set("orderReference", orderReference);

    const response = await POST(
      new Request("https://example.org/api/wayforpay/return", { method: "POST", body: formData }),
    );

    expect(response.headers.get("location")).toBe("https://example.org/");
  });
});
