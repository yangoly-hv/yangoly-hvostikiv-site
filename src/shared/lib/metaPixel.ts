import { getMetaClickIds } from "@/shared/lib/metaClickIds";
import { getMetaPixelId } from "@/shared/lib/metaPixelId";
import { getMetaExternalId } from "@/shared/lib/metaVisitorId";

export { getMetaPixelId };

const DONATE_DEDUP_PREFIX = "meta-pixel-donate:";
export const FBQ_RETRY_MS = 100;
export const FBQ_RETRY_ATTEMPTS = 30;
const RETRY_AFTER_CAP_SECONDS = 10;

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

export type MetaBrowserEventName =
  | "PageView"
  | "Contact"
  | "Donate"
  | "Lead"
  | "StartPartnership";

type MetaAdvancedMatching = {
  em?: string;
  ph?: string;
  external_id?: string;
};

const canTrack = () =>
  typeof window !== "undefined" && Boolean(getMetaPixelId()) && Boolean(window.fbq);

const omitEmpty = (value: Record<string, string | undefined>) =>
  Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ) as MetaAdvancedMatching;

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

const initMetaPixel = (advancedMatching: MetaAdvancedMatching = {}): boolean => {
  if (!canTrack() || !window.fbq) return false;
  const pixelId = getMetaPixelId();
  if (!pixelId) return false;
  try {
    const payload = omitEmpty(advancedMatching);
    if (Object.keys(payload).length > 0) {
      window.fbq("init", pixelId, payload);
    } else {
      window.fbq("init", pixelId);
    }
    return true;
  } catch {
    return false;
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

const trackCustom = (
  eventName: string,
  params: Record<string, unknown>,
  eventId: string,
): boolean => {
  if (!canTrack() || !window.fbq) return false;
  try {
    window.fbq("trackCustom", eventName, params, { eventID: eventId });
    return true;
  } catch {
    return false;
  }
};

const retryUntilTracked = (tryTrack: () => boolean) => {
  if (tryTrack()) return;
  let attempts = 0;
  const retry = () => {
    if (tryTrack()) return;
    attempts += 1;
    if (attempts >= FBQ_RETRY_ATTEMPTS) return;
    setTimeout(retry, FBQ_RETRY_MS);
  };
  setTimeout(retry, FBQ_RETRY_MS);
};

const waitUntilTracked = (tryTrack: () => boolean) =>
  new Promise<boolean>((resolve) => {
    if (tryTrack()) {
      resolve(true);
      return;
    }
    let attempts = 0;
    const retry = () => {
      if (tryTrack()) {
        resolve(true);
        return;
      }
      attempts += 1;
      if (attempts >= FBQ_RETRY_ATTEMPTS) {
        resolve(false);
        return;
      }
      setTimeout(retry, FBQ_RETRY_MS);
    };
    setTimeout(retry, FBQ_RETRY_MS);
  });

const visitorAdvancedMatching = (extra: MetaAdvancedMatching = {}) =>
  omitEmpty({
    external_id: getMetaExternalId() || undefined,
    ...extra,
  });

const browserUserData = () => {
  const clickIds =
    typeof document === "undefined"
      ? {}
      : getMetaClickIds({
          cookieHeader: document.cookie,
          href: window.location.href,
        });
  const externalId = getMetaExternalId() || undefined;
  return omitEmpty({
    fbp: clickIds.fbp,
    fbc: clickIds.fbc,
    externalId,
  });
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const retryAfterMs = (response: Response) => {
  const parsed = Number(response.headers.get("Retry-After"));
  const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  return Math.min(seconds, RETRY_AFTER_CAP_SECONDS) * 1000;
};

const postMetaEvent = async (body: string) => {
  try {
    const response = await fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    if (response.status !== 429) return;
    await sleep(retryAfterMs(response));
    await fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/meta/events", new Blob([body], { type: "application/json" }));
      }
    } catch {
      // Pixel must stay independent of CAPI transport.
    }
  }
};

export const createMetaEventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const trackPageView = ({ eventId }: { eventId: string }): boolean =>
  track("PageView", {}, eventId);

export const trackCompleteRegistration = ({
  eventId,
  status = true,
  email,
  phone,
}: {
  eventId: string;
  status?: boolean;
  email?: string;
  phone?: string;
}) => {
  if (typeof window === "undefined" || !getMetaPixelId()) return;
  retryUntilTracked(() => {
    initMetaPixel(visitorAdvancedMatching({ em: email, ph: phone }));
    return track("CompleteRegistration", { status }, eventId);
  });
};

export const trackContact = ({ eventId }: { eventId: string }) => {
  track("Contact", {}, eventId);
};

export const trackStartPartnership = ({ eventId }: { eventId: string }) =>
  trackCustom("StartPartnership", {}, eventId);

export const trackLead = ({ eventId, phone }: { eventId: string; phone?: string }) => {
  if (typeof window === "undefined" || !getMetaPixelId()) return;
  retryUntilTracked(() => {
    initMetaPixel(visitorAdvancedMatching({ ph: phone }));
    return track("Lead", {}, eventId);
  });
  try {
    reportMetaBrowserEvent({ eventName: "Lead", eventId });
  } catch {
    // CAPI must not block Pixel.
  }
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
  retryUntilTracked(() => fireDonateConversion({ orderReference, value, currency }));
};

export const reportMetaBrowserEvent = (payload: {
  eventName: MetaBrowserEventName;
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
      ...browserUserData(),
    });
    void postMetaEvent(body);
  } catch {
    // Ignore serialization / location failures; Pixel must stay independent.
  }
};

export const trackPageViewAndReport = () => {
  if (typeof window === "undefined" || !getMetaPixelId()) return;
  const eventId = createMetaEventId();
  void waitUntilTracked(() => {
    initMetaPixel(visitorAdvancedMatching());
    return trackPageView({ eventId });
  }).then(() => {
    reportMetaBrowserEvent({ eventName: "PageView", eventId });
  });
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

export const trackStartPartnershipClick = () => {
  const eventId = createMetaEventId();
  try {
    trackStartPartnership({ eventId });
  } catch {
    // Pixel must not block CAPI.
  }
  try {
    reportMetaBrowserEvent({ eventName: "StartPartnership", eventId });
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
