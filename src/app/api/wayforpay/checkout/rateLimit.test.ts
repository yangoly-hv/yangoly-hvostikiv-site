import { afterEach, describe, expect, it } from "vitest";

import { checkCheckoutRateLimit, resetCheckoutRateLimitForTests } from "./rateLimit";

const request = new Request("https://example.org/api/wayforpay/checkout", {
  headers: { "x-forwarded-for": "203.0.113.42" },
});

describe("checkout rate limit", () => {
  afterEach(() => {
    resetCheckoutRateLimitForTests();
  });

  it("allows ten attempts per ten-minute window and limits the next one", () => {
    for (let index = 0; index < 10; index += 1) {
      expect(checkCheckoutRateLimit(request, 1_000).limited).toBe(false);
    }

    expect(checkCheckoutRateLimit(request, 1_000)).toEqual({ limited: true, retryAfterSeconds: 600 });
  });
});
