import { afterEach, describe, expect, it } from "vitest";

import {
  checkContactRequestRateLimit,
  resetContactRateLimitForTests,
} from "./rateLimit";

const request = new Request("https://example.org/api/contact", {
  headers: { "x-forwarded-for": "203.0.113.10" },
});

describe("contact rate limit", () => {
  afterEach(() => {
    resetContactRateLimitForTests();
  });

  it("allows five requests per ten-minute window and limits the next one", async () => {
    for (let index = 0; index < 5; index += 1) {
      await expect(checkContactRequestRateLimit(request, 1_000)).resolves.toMatchObject({
        limited: false,
      });
    }

    await expect(checkContactRequestRateLimit(request, 1_000)).resolves.toMatchObject({
      limited: true,
      retryAfterSeconds: 600,
    });
  });

  it("starts a new window after ten minutes", async () => {
    await expect(checkContactRequestRateLimit(request, 1_000)).resolves.toMatchObject({
      limited: false,
    });
    await expect(
      checkContactRequestRateLimit(request, 1_000 + 10 * 60 * 1000),
    ).resolves.toMatchObject({ limited: false });
  });

});
