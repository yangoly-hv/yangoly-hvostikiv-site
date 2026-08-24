# Pixel / CAPI score pass — implementation plan

> Implement against [docs/superpowers/specs/2026-08-24-pixel-capi-score-design.md](../specs/2026-08-24-pixel-capi-score-design.md). TDD with Vitest. Do not add a second PageView track. Do not remove the app-side `/api/meta/events` rate limit.

**Goal:** Raise PageView coverage and Event Match Quality by sending CAPI after Pixel init with click IDs and a first-party `external_id`, preferring IPv6, then passing already-collected PII into Pixel AAM and consented Donate CAPI.

**Architecture:** Client owns `external_id` / `fbp` / `fbc`. Server relay merges validated body IDs with cookies, picks a public IP, and forwards Graph CAPI. Shared `event_id` is unchanged.

**Tech stack:** Next.js App Router, Meta Pixel (`fbq`), Conversions API v21.0, Vitest.

---

### Task 1: Visitor id + click ids

**Files:**

- Create: `src/shared/lib/metaVisitorId.ts`
- Create: `src/shared/lib/metaVisitorId.test.ts`
- Create: `src/shared/lib/metaClickIds.ts`
- Create: `src/shared/lib/metaClickIds.test.ts`

- [x] Persist UUID in `localStorage` key `meta-external-id`; in-memory fallback
- [x] Validate `fbp` / `fbc` / `externalId` with the spec regexes
- [x] Parse `_fbp` / `_fbc` from a cookie header
- [x] Build `fbc` from `fbclid` when the cookie is missing

### Task 2: CAPI IPv6 picker

**Files:**

- Modify: `src/shared/lib/metaCapi.ts`
- Modify: `src/shared/lib/metaCapi.test.ts`

- [x] Export `pickClientIpAddress` used by `getMetaCapiRequestContext`
- [x] Prefer first public IPv6 over IPv4; skip loopback / link-local / private when a public candidate exists
- [x] Log Graph failures as `{ eventName, status }`

### Task 3: Relay user data

**Files:**

- Modify: `src/app/api/meta/events/route.ts`
- Modify: `src/app/api/meta/events/route.test.ts`
- Create: `src/app/api/meta/events/rateLimit.test.ts`

- [x] Accept optional validated `fbp` / `fbc` / `externalId` from JSON
- [x] Prefer valid body values over cookies
- [x] Ignore `email` / `phone` (do not forward)
- [x] Keep 120 / 10 min / IP; return `Retry-After` on 429

### Task 4: Pixel client

**Files:**

- Modify: `src/shared/lib/metaPixel.ts`
- Modify: `src/shared/lib/metaPixel.test.ts`
- Modify: `src/shared/components/MetaPixel/MetaPixel.tsx`

- [x] Client `fbq('init', pixelId, { external_id })` before track
- [x] PageView: wait for Pixel (or retry budget), then CAPI
- [x] Include click IDs + `externalId` on the beacon
- [x] One 429 retry via `fetch` + `keepalive`, `Retry-After` capped at 10s
- [x] Stop empty `init` in the server snippet

### Task 5: Lead / CompleteRegistration AAM

**Files:**

- Modify: `src/shared/lib/metaPixel.ts`
- Modify: `src/shared/lib/metaPixel.test.ts`
- Modify: `src/features/contact-request/model/useContactRequest.ts`
- Modify: `src/features/event-registration/model/useEventRegistration.ts`

- [x] `trackLead({ eventId, phone })` inits with `ph` + `external_id`
- [x] `trackCompleteRegistration({ eventId, email, phone })` inits with `em`, `ph`, `external_id`
- [x] Contact and event-registration CAPI routes unchanged

### Task 6: Consented Donate CAPI PII

**Files:**

- Modify: `src/app/api/wayforpay/callback/route.ts`
- Modify: `src/app/api/wayforpay/callback/route.test.ts`

- [x] `persistCallback` returns `wantNotifications`
- [x] Schedule Donate with hashed email/phone only when consented
- [x] Keep `externalId: orderReference`

### Task 7: Verify

```
npx vitest run src/shared/lib/metaVisitorId.test.ts src/shared/lib/metaClickIds.test.ts src/shared/lib/metaCapi.test.ts src/shared/lib/metaPixel.test.ts src/app/api/meta/events/route.test.ts src/app/api/meta/events/rateLimit.test.ts src/app/api/wayforpay/callback/route.test.ts
npm test
```
