# Pixel / CAPI score pass

**Date:** 2026-08-24  
**Status:** Approved for implementation

## Goal

Move Meta PageView from 35% coverage / 4.9 event match quality / failed dedup toward ≥75% coverage and a higher EMQ, without a second Pixel PageView and without inventing email or phone on anonymous views.

## In scope

- PageView CAPI reliability (Graph error logging, one client retry on app 429)
- `fbp` / `fbc` after Pixel init, plus `fbc` rebuilt from `fbclid`
- First-party `external_id` on Pixel init and CAPI
- Prefer IPv6 on CAPI when the forwarded chain has a public IPv6
- Pixel advanced matching on Lead (phone) and CompleteRegistration (email + phone)
- Hashed email/phone on completed Donate CAPI only when `wantNotifications === true`

## Out of scope

- Facebook Login ID
- A second `fbq('track', 'PageView')` in the snippet
- Email/phone on PageView
- Persisting `_fbp` / `_fbc` on the Sanity payment order for the WayForPay callback
- Removing the app-side rate limit on `/api/meta/events` (120 / 10 min / IP)
- Graph-side throttling (log status only)

## Non-negotiable wiring

Keep the shared `event_id` scheme:

- Client UUID for PageView, Contact, and Donate-mono
- Server UUID returned to Pixel for Lead and CompleteRegistration
- `orderReference` (or occurrence id) for completed Donate

## Architecture

Client owns identity. Server owns IP and user agent.

`POST /api/meta/events` must not accept email or phone in JSON. It may accept validated `fbp`, `fbc`, and `externalId`.

PageView order:

1. Create `eventId` and `externalId`
2. `fbq('init', pixelId, { external_id })` then track, retrying up to 30 × 100ms
3. Read `_fbp` / `_fbc` from cookies, or build `fbc` from `fbclid`
4. Beacon CAPI always, including when `fbq` never appeared
5. If the relay returns 429, retry once after `Retry-After` (cap 10s) via `fetch` + `keepalive`

## Requirements

**R1.** Send CAPI even if Pixel never loads, but prefer sending after Pixel init.

**R2.** Keep the app rate limit at 120 / 10 min / IP. Log Graph failures as `{ eventName, status }`.

**R3.** After init, read click IDs from `document.cookie`. If `_fbc` is missing and the URL has `fbclid`, set `fbc` to `fb.1.{ms}.{fbclid}`. POST those on the beacon. The relay prefers valid body values over the Cookie header.

**R4.** Persist a UUID in `localStorage` (`meta-external-id`). Fallback: in-memory for the session. Pass plaintext to Pixel init and to CAPI `userData.externalId` (CAPI hashes).

**R5.** Load `fbevents.js` from the server snippet without baking an empty `init`. Client init with `external_id` before track. Noscript PageView image stays as-is.

**R6.** Collect `x-forwarded-for` (split), `x-real-ip`, `cf-connecting-ip`. Prefer the first public IPv6; else the first public IPv4. Do not send loopback, link-local, or private if a public candidate exists.

**R7.** Lead: `trackLead({ eventId, phone })` re-inits Pixel with `ph` and `external_id`. CompleteRegistration: init with `em`, `ph`, and `external_id`. Do not POST PII to `/api/meta/events`. CAPI routes for those events already send hashed PII; leave them.

**R8.** Completed Donate CAPI includes hashed email/phone only when `order.wantNotifications === true`. Keep `externalId: orderReference`.

**R9.** Beacon validation:

- `fbp`: `fb.1.<digits>.<digits>`
- `fbc`: `fb.1.<digits>.<token>` (`fbclid` charset)
- `externalId`: 8–128 chars, `[A-Za-z0-9_-]`
- Ignore invalid fields; still send IP/UA
- Do not forward `email` / `phone` keys

## Success checks (Events Manager, not CI)

- PageView coverage trending toward ≥75% over 7 days after deploy
- `fbp` coverage well above 46%
- `external_id` appearing on PageView
- IPv6 recommendation dismissed or reduced
- Dedup warning eases once coverage is healthy
- Lead, CompleteRegistration, and consented Donate show hashed em/ph as applicable
