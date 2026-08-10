export const META_PIXEL_ID = "1830700294751912";

const DONATE_DEDUP_PREFIX = "meta-pixel-donate:";

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: FbqFunction;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export type DonateEventPayload = {
  orderReference: string;
  value: number;
  currency: string;
};

const hasTrackedDonate = (orderReference: string) => {
  try {
    return window.sessionStorage.getItem(`${DONATE_DEDUP_PREFIX}${orderReference}`) === "1";
  } catch {
    return false;
  }
};

const markDonateTracked = (orderReference: string) => {
  try {
    window.sessionStorage.setItem(`${DONATE_DEDUP_PREFIX}${orderReference}`, "1");
  } catch {
    // Ignore storage failures; Meta eventID still helps dedupe.
  }
};

export const trackDonateConversion = ({
  orderReference,
  value,
  currency,
}: DonateEventPayload) => {
  if (typeof window === "undefined" || !window.fbq) return;
  if (hasTrackedDonate(orderReference)) return;

  window.fbq(
    "track",
    "Donate",
    {
      value,
      currency,
    },
    { eventID: orderReference },
  );
  markDonateTracked(orderReference);
};
