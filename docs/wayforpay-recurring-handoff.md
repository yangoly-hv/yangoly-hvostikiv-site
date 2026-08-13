# WayForPay recurring donations handoff

## What is implemented

The site uses WayForPay-managed recurring payments. The first payment is a signed Purchase; after it is approved, WayForPay owns the monthly schedule. The site never receives card details.

| Flow | `donationPurpose` | `donationSchedule` | Amount source |
| --- | --- | --- | --- |
| Home one-time / header «Разова допомога» | — | — | Monobank jar from `siteSettings.monobankJarUrl` |
| Tail one-time help | `tail-one-time` | `oneTime` | Donor input (WayForPay) |
| Tail guardianship | `tail-guardianship` | `monthly` | Current `keeping_price` from Sanity, verified on the server (WayForPay) |
| Collection | — | — | Monobank jar from collection `monobankLongJarId` |

Monthly checkout adds these fields to the standard signed Purchase payload:

```json
{
  "regularMode": "monthly",
  "regularBehavior": "preset",
  "regularOn": 1,
  "regularAmount": 500,
  "dateNext": "05.09.2026",
  "paymentSystems": "card;googlePay;applePay"
}
```

`dateEnd` and `regularCount` are intentionally omitted: the schedule remains active until the payer cancels it in WayForPay. `dateNext` is one calendar month after checkout using the `Europe/Kyiv` calendar and is clamped to the target month's final day.

Monthly requests require both `isAgreed` and `isRecurringAgreed`. The server rejects an incompatible purpose/schedule pair and a stale guardianship amount before creating a payment order.

## Storage and callbacks

Payment data is stored only in the private Sanity payments dataset:

- `donateOrder` represents the checkout and, for monthly donations, the recurring schedule;
- `paymentOccurrence` represents one actual charge and is keyed by a hash of merchant account, order reference and WayForPay `authCode`;
- `wayforpayCallback` keeps each signed delivery and references its occurrence;
- `paymentEffect` makes collection updates, donor entries and internal email delivery retryable and idempotent per occurrence.

An exact callback retry and a reconciliation response for the same `authCode` reuse the occurrence. A later monthly charge with another `authCode` creates a new occurrence. A refund changes only the matching occurrence. Raw callback payloads and `recToken` remain AES-256-GCM encrypted.

Example callback shape used by the automated tests:

```json
{
  "merchantAccount": "merchant",
  "orderReference": "DONATE_123e4567-e89b-12d3-a456-426614174000",
  "amount": 500,
  "currency": "UAH",
  "authCode": "123456",
  "cardPan": "42****4242",
  "transactionStatus": "Approved",
  "reasonCode": "1100",
  "processingDate": 1700000000,
  "merchantSignature": "<HMAC_MD5>"
}
```

## Required production environment

```text
WAYFORPAY_ACCOUNT
WAYFORPAY_SECRET
WAYFORPAY_DOMAIN
NEXT_PUBLIC_BASE_URL
SANITY_PAYMENTS_DATASET
SANITY_PAYMENTS_TOKEN
PAYMENTS_ENCRYPTION_KEY
CRON_SECRET
```

`WAYFORPAY_SECRET`, `SANITY_PAYMENTS_TOKEN` and `PAYMENTS_ENCRYPTION_KEY` must remain server-only. A WayForPay `merchantPassword` is not required because the site does not call `regularApi`; cancellation and subscription management stay in WayForPay.

## Cabinet and live sign-off

The developer with WayForPay access must:

1. Enable recurring payments for the production merchant.
2. Confirm card, Google Pay and Apple Pay are enabled for recurring payments.
3. Install the production account, secret, domain and public base URL in the deployment environment.
4. Confirm `https://<domain>/api/wayforpay/callback` and `/api/wayforpay/return` are publicly reachable over HTTPS.
5. Have the foundation approve the recurring-consent wording and update the public offer if required.
6. Complete a small monthly donation from the home form and one guardianship payment.
7. Verify that both initial callbacks are accepted, occurrences appear in `/payments`, and both recurring payments are Active with the expected next date.
8. Verify cancellation from the payer's WayForPay personal account.
9. Inspect the first automatic charge callback. Confirm that WayForPay keeps the original `orderReference`, supplies a new `authCode`, and that a second occurrence and notification are created. If the live callback uses a different stable transaction identifier, update the occurrence fingerprint before production sign-off.
10. Run a one-time donation regression check.

Official references: [Purchase API](https://wiki.wayforpay.com/view/852102), [regular payments](https://wiki.wayforpay.com/view/852496), [payer cancellation](https://help.wayforpay.com/view/634102953), and [test merchant credentials](https://wiki.wayforpay.com/view/852472).

## Verification commands

From `yangoly-hvostikiv-site`:

```text
yarn test
yarn typecheck
yarn lint
yarn build
yarn test:e2e
```

From `yangoly-admin`:

```text
yarn build
```

Local verification completed on 2026-08-05:

- Vitest: 22 files, 130 tests passed;
- TypeScript and ESLint: passed;
- Next.js production build: passed, 133 static pages generated;
- Playwright: 11 Chromium scenarios passed, including both recurring checkout entry points;
- Sanity Studio production build: passed.

The live payment and first scheduled charge cannot be certified without access to the production WayForPay merchant. That is the only provider-dependent acceptance boundary.
