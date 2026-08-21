import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
/** Higher ceiling so PageView beacons from normal browsing do not starve click events. */
const MAX_REQUESTS_PER_WINDOW = 120;

type RateLimitBucket = {
  startedAt: number;
  count: number;
};

export type MetaEventsRateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitBucket>();

const firstHeaderValue = (value: string | null) =>
  value?.split(",")[0]?.trim() || null;

const getClientKey = (request: Request) => {
  const address =
    firstHeaderValue(request.headers.get("x-real-ip")) ||
    firstHeaderValue(request.headers.get("cf-connecting-ip")) ||
    firstHeaderValue(request.headers.get("x-forwarded-for")) ||
    "unknown";
  return createHash("sha256").update(address).digest("hex");
};

export const checkMetaEventsRateLimit = (
  request: Request,
  now = Date.now(),
): MetaEventsRateLimitResult => {
  for (const [key, bucket] of buckets) {
    if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(key);
  }

  const key = getClientKey(request);
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return { limited: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1_000) };
  }

  bucket.count += 1;
  return {
    limited: bucket.count > MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - bucket.startedAt)) / 1_000),
    ),
  };
};

export function resetMetaEventsRateLimitForTests() {
  buckets.clear();
}
