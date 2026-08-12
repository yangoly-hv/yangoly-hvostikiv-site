import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

type RateLimitBucket = {
  startedAt: number;
  count: number;
};

export type EventRegistrationRateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitBucket>();

const firstHeaderValue = (value: string | null) =>
  value?.split(",")[0]?.trim() || null;

const getClientAddress = (request: Request) =>
  firstHeaderValue(request.headers.get("x-real-ip")) ||
  firstHeaderValue(request.headers.get("cf-connecting-ip")) ||
  firstHeaderValue(request.headers.get("x-forwarded-for")) ||
  "unknown";

const getClientKey = (request: Request) =>
  createHash("sha256").update(getClientAddress(request)).digest("hex");

function consumeLocalRateLimit(
  request: Request,
  now: number,
): EventRegistrationRateLimitResult {
  for (const [key, value] of buckets) {
    if (now - value.startedAt >= WINDOW_MS) buckets.delete(key);
  }

  const key = getClientKey(request);
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return {
      limited: false,
      retryAfterSeconds: Math.ceil(WINDOW_MS / 1_000),
    };
  }

  bucket.count += 1;
  return {
    limited: bucket.count > MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - bucket.startedAt)) / 1_000),
    ),
  };
}

export async function checkEventRegistrationRateLimit(
  request: Request,
  now = Date.now(),
): Promise<EventRegistrationRateLimitResult> {
  return consumeLocalRateLimit(request, now);
}

export function resetEventRegistrationRateLimitForTests() {
  buckets.clear();
}
