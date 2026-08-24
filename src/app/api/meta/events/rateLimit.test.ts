import { afterEach, describe, expect, it } from "vitest";

import {
  checkMetaEventsRateLimit,
  resetMetaEventsRateLimitForTests,
} from "./rateLimit";

const request = new Request("https://example.org/api/meta/events", {
  headers: { "x-real-ip": "203.0.113.10" },
});

describe("meta events rate limit", () => {
  afterEach(() => {
    resetMetaEventsRateLimitForTests();
  });

  it("allows 120 requests per ten-minute window and limits the next one", () => {
    for (let index = 0; index < 120; index += 1) {
      expect(checkMetaEventsRateLimit(request, 1_000)).toMatchObject({ limited: false });
    }

    expect(checkMetaEventsRateLimit(request, 1_000)).toMatchObject({
      limited: true,
      retryAfterSeconds: 600,
    });
  });

  it("starts a new window after ten minutes", () => {
    expect(checkMetaEventsRateLimit(request, 1_000)).toMatchObject({ limited: false });
    expect(
      checkMetaEventsRateLimit(request, 1_000 + 10 * 60 * 1000),
    ).toMatchObject({ limited: false });
  });
});
