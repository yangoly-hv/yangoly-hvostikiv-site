# Image optimization sweep (production)

Date: 2026-08-09  
Live target: [https://angelsua.org/en](https://angelsua.org/en)

## How accurate was the sweep?

| Claim | Verdict |
| --- | --- |
| Root cause is Vercel `/_next/image` → `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` | **Accurate** (also saw `400 INVALID_IMAGE_OPTIMIZE_REQUEST`) |
| Direct static files still `200` | **Accurate** |
| Some images still work because of optimizer cache | **Accurate** (do not kill global optimization) |
| Broken areas: logo, monthly goal Sanity photo, Change Life, About gallery, What Makes Us Different, What Changes, partnership, tails, blog, reporting | **Accurate** for home + listed routes |
| `/en/about`, `/en/events`, `/en/contacts` 404 | **Accurate** for those paths; content lives on other pages |
| Sweep target list covered all `next/image` call sites | **Incomplete** — missed Hero, DonationForm icons, Contacts, HelpAnimalsList, PartnershipHelpCards (paws/cards), Events*, Volunteering*, ChairtyBlocks*, LargePhotoModal, ThankYouModal, etc. |
| “SafeImage never falls back because requests hang” | **Overstated** — early probe caught in-flight loads; 402 should fire `onError`. Still added a `naturalWidth === 0` `onLoad` guard |

## Root cause

Vercel Image Optimization quota/plan: new transformations fail with 402/400. Cached optimized responses can keep working. Originals load fine without `/_next/image`.

## Fix applied

1. **Kept optimization on** (no global `images.unoptimized`).
2. **Wired `SafeImage` site-wide** — every former `next/image` call site under `src/` except `SafeImage.tsx` itself (~45 files). Optimizer first; on error / 0×0 load → retry direct `src`.
3. **`SafeImage` harden** — `onLoad` treats `naturalWidth === 0` as failure and falls back.
4. **No partner/logo sizing churn** — reverted `PartnersListItem` / Logo `sizes` tweaks so existing optimizer cache keys stay valid; `fill` + `object-contain` keeps logos like WellFood filling the card.

## Pages swept (EN)

| Route | Result |
| --- | --- |
| `/en` | Logo, monthly-goal Sanity photo, Change Life, About gallery, What Makes Us Different, What Changes, footer logo |
| `/en/tails` | Logo + CMS tail cards |
| `/en/partnership` | Logo, help cards, partner logos, hero paws |
| `/en/volunteering` | Same optimizer pattern |
| `/en/reporting` | Same |
| `/en/blog` | Same |
| `/en/about`, `/en/events`, `/en/contacts` | No separate routes (404) |

## If quota is hit again

- Cached optimized URLs may still load.
- New transformations 402 → `SafeImage` falls back to direct `src`.
- Optional: raise plan / longer `minimumCacheTTL` / per-image `unoptimized` for tiny SVGs — not a global kill switch.
