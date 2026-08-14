import { getMetaPixelId } from "@/shared/lib/metaPixelId";

export { getMetaPixelId };

const DONATE_DEDUP_PREFIX = "meta-pixel-donate:";
const DONATE_FBQ_RETRY_MS = 100;
const DONATE_FBQ_RETRY_ATTEMPTS = 10;

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

export type DonateStatus = "mono" | "completed";

export type DonateEventPayload = {
  orderReference: string;
  value: number;
  currency: string;
};

const canTrack = () =>
  typeof window !== "undefined" && Boolean(getMetaPixelId()) && Boolean(window.fbq);

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

const track = (
  eventName: string,
  params: Record<string, unknown>,
  eventId: string,
): boolean => {
  if (!canTrack() || !window.fbq) return false;
  try {
    window.fbq("track", eventName, params, { eventID: eventId });
    return true;
  } catch {
    return false;
  }
};

export const createMetaEventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const trackCompleteRegistration = ({
  eventId,
  status = true,
}: {
  eventId: string;
  status?: boolean;
}) => {
  track("CompleteRegistration", { status }, eventId);
};

export const trackContact = ({ eventId }: { eventId: string }) => {
  track("Contact", {}, eventId);
};

export const trackLead = ({ eventId }: { eventId: string }) => {
  track("Lead", {}, eventId);
};

export const trackDonate = ({
  eventId,
  status,
  value,
  currency,
}: {
  eventId: string;
  status: DonateStatus;
  value?: number;
  currency?: string;
}): boolean => {
  const params: Record<string, unknown> = { status };
  if (status === "completed") {
    if (typeof value === "number") params.value = value;
    if (currency) params.currency = currency;
  }
  return track("Donate", params, eventId);
};

const fireDonateConversion = (payload: DonateEventPayload) => {
  if (hasTrackedDonate(payload.orderReference)) return true;
  const tracked = trackDonate({
    eventId: payload.orderReference,
    status: "completed",
    value: payload.value,
    currency: payload.currency,
  });
  if (tracked) markDonateTracked(payload.orderReference);
  return tracked;
};

export const trackDonateConversion = ({
  orderReference,
  value,
  currency,
}: DonateEventPayload) => {
  if (typeof window === "undefined" || !getMetaPixelId()) return;
  if (hasTrackedDonate(orderReference)) return;
  if (fireDonateConversion({ orderReference, value, currency })) return;

  let attempts = 0;
  const retry = () => {
    if (typeof window === "undefined" || !getMetaPixelId()) return;
    if (fireDonateConversion({ orderReference, value, currency })) return;
    attempts += 1;
    if (attempts >= DONATE_FBQ_RETRY_ATTEMPTS) return;
    setTimeout(retry, DONATE_FBQ_RETRY_MS);
  };
  setTimeout(retry, DONATE_FBQ_RETRY_MS);
};

export const reportMetaBrowserEvent = (payload: {
  eventName: "Contact" | "Donate";
  eventId: string;
  customData?: Record<string, unknown>;
}) => {
  if (typeof window === "undefined" || !getMetaPixelId()) return;

  try {
    const body = JSON.stringify({
      eventName: payload.eventName,
      eventId: payload.eventId,
      eventSourceUrl: window.location.href,
      customData: payload.customData,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/meta/events", blob)) return;
      }
    } catch {
      // Fall through to fetch.
    }

    void fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Ignore serialization / location failures; Pixel must stay independent.
  }
};

export const trackContactClick = () => {
  const eventId = createMetaEventId();
  try {
    trackContact({ eventId });
  } catch {
    // Pixel must not block CAPI.
  }
  try {
    reportMetaBrowserEvent({ eventName: "Contact", eventId });
  } catch {
    // CAPI must not block Pixel.
  }
};

export const trackMonoDonateClick = () => {
  const eventId = createMetaEventId();
  try {
    trackDonate({ eventId, status: "mono" });
  } catch {
    // Pixel must not block CAPI.
  }
  try {
    reportMetaBrowserEvent({
      eventName: "Donate",
      eventId,
      customData: { status: "mono" },
    });
  } catch {
    // CAPI must not block Pixel.
  }
};
