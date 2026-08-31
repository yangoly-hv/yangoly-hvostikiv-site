import { NextResponse } from "next/server";

import {
  getMetaCapiRequestContext,
  scheduleMetaCapiEvent,
} from "@/shared/lib/metaCapi";
import {
  isValidMetaExternalId,
  isValidMetaFbc,
  isValidMetaFbp,
} from "@/shared/lib/metaClickIds";

import { checkMetaEventsRateLimit } from "./rateLimit";

const MAX_REQUEST_BODY_BYTES = 4 * 1024;

const isBrowserForwardedEventName = (
  value: unknown,
): value is "PageView" | "Contact" | "Donate" | "Lead" | "StartPartnership" =>
  value === "PageView" ||
  value === "Contact" ||
  value === "Donate" ||
  value === "Lead" ||
  value === "StartPartnership";

const isNonEmptyString = (value: unknown, min: number, max: number): value is string =>
  typeof value === "string" && value.trim().length >= min && value.length <= max;

const readJsonBody = async (request: Request): Promise<unknown> => {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  return JSON.parse(body);
};

const sanitizeFbp = (value: unknown) =>
  typeof value === "string" && isValidMetaFbp(value) ? value : undefined;

const sanitizeFbc = (value: unknown) =>
  typeof value === "string" && isValidMetaFbc(value) ? value : undefined;

const sanitizeExternalId = (value: unknown) =>
  typeof value === "string" && isValidMetaExternalId(value) ? value : undefined;

const sanitizeEventSourceUrl = (value: unknown) => {
  if (typeof value !== "string" || value.length > 2048) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return value;
  } catch {
    return undefined;
  }
};

const DONATE_BROWSER_STATUSES = new Set(["mono", "started", "payment_started"]);

const sanitizeShortLabel = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > maxLength) return undefined;
  return trimmed;
};

const sanitizeDonateCustomData = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const status = raw.status;
  if (typeof status !== "string" || !DONATE_BROWSER_STATUSES.has(status)) return undefined;

  const customData: {
    status: "mono" | "started" | "payment_started";
    purpose?: string;
    name?: string;
    donorName?: string;
    schedule?: "oneTime" | "monthly";
    value?: number;
    currency?: string;
  } = { status: status as "mono" | "started" | "payment_started" };

  const purpose = sanitizeShortLabel(raw.purpose, 64);
  if (purpose) customData.purpose = purpose;

  const name = sanitizeShortLabel(raw.name, 100);
  if (name) customData.name = name;

  const donorName = sanitizeShortLabel(raw.donorName, 100);
  if (donorName) customData.donorName = donorName;

  if (raw.schedule === "oneTime" || raw.schedule === "monthly") {
    customData.schedule = raw.schedule;
  }

  if (typeof raw.value === "number" && Number.isFinite(raw.value) && raw.value > 0) {
    customData.value = raw.value;
  }

  if (typeof raw.currency === "string" && /^[A-Z]{3}$/.test(raw.currency)) {
    customData.currency = raw.currency;
  }

  return customData;
};

export async function POST(request: Request) {
  const rateLimit = checkMetaEventsRateLimit(request);
  if (rateLimit.limited) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let input: unknown;
  try {
    input = await readJsonBody(request);
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ success: false, error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    }
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const { eventName, eventId, eventSourceUrl, customData, fbp, fbc, externalId } =
    input as {
      eventName?: unknown;
      eventId?: unknown;
      eventSourceUrl?: unknown;
      customData?: unknown;
      fbp?: unknown;
      fbc?: unknown;
      externalId?: unknown;
    };

  if (!isBrowserForwardedEventName(eventName)) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
  if (!isNonEmptyString(eventId, 8, 128)) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
  if (eventName === "Donate") {
    const sanitizedDonateCustomData = sanitizeDonateCustomData(customData);
    if (!sanitizedDonateCustomData) {
      return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const requestContext = getMetaCapiRequestContext(request);
    const bodyFbp = sanitizeFbp(fbp);
    const bodyFbc = sanitizeFbc(fbc);
    const bodyExternalId = sanitizeExternalId(externalId);

    void scheduleMetaCapiEvent({
      eventName,
      eventId: eventId.trim(),
      eventSourceUrl: sanitizeEventSourceUrl(eventSourceUrl),
      customData: sanitizedDonateCustomData,
      userData: {
        ...requestContext,
        ...(bodyFbp ? { fbp: bodyFbp } : {}),
        ...(bodyFbc ? { fbc: bodyFbc } : {}),
        ...(bodyExternalId ? { externalId: bodyExternalId } : {}),
      },
    });

    return NextResponse.json({ success: true });
  }

  const requestContext = getMetaCapiRequestContext(request);
  const bodyFbp = sanitizeFbp(fbp);
  const bodyFbc = sanitizeFbc(fbc);
  const bodyExternalId = sanitizeExternalId(externalId);

  void scheduleMetaCapiEvent({
    eventName,
    eventId: eventId.trim(),
    eventSourceUrl: sanitizeEventSourceUrl(eventSourceUrl),
    customData: undefined,
    userData: {
      ...requestContext,
      ...(bodyFbp ? { fbp: bodyFbp } : {}),
      ...(bodyFbc ? { fbc: bodyFbc } : {}),
      ...(bodyExternalId ? { externalId: bodyExternalId } : {}),
    },
  });

  return NextResponse.json({ success: true });
}
