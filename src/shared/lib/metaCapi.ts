import "server-only";

import { createHash } from "node:crypto";
import { after } from "next/server";

import { getMetaPixelId } from "@/shared/lib/metaPixelId";

const GRAPH_VERSION = "v21.0";
const CAPI_TIMEOUT_MS = 3_000;

export type MetaCapiEventName =
  | "PageView"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "Donate";

export type MetaCapiCustomData = {
  status?: boolean | "mono" | "completed";
  value?: number;
  currency?: string;
};

export type MetaCapiUserDataInput = {
  email?: string;
  phone?: string;
  externalId?: string;
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
};

export type SendMetaCapiEventInput = {
  eventName: MetaCapiEventName;
  eventId: string;
  eventSourceUrl?: string;
  customData?: MetaCapiCustomData;
  userData?: MetaCapiUserDataInput;
};

const firstHeaderValue = (value: string | null) =>
  value?.split(",")[0]?.trim() || undefined;

const omitEmpty = (value: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === "") return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      if (typeof entry === "object" && entry !== null && Object.keys(entry).length === 0) {
        return false;
      }
      return true;
    }),
  );

export const hashMetaUserValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export const normalizeMetaEmail = (email: string) => email.trim().toLowerCase();

export const normalizeMetaPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("380")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `38${digits}`;
  return digits;
};

export const buildMetaCapiUserData = (input: MetaCapiUserDataInput = {}) => {
  const em = input.email
    ? [hashMetaUserValue(normalizeMetaEmail(input.email))]
    : undefined;
  const ph = input.phone
    ? [hashMetaUserValue(normalizeMetaPhone(input.phone))]
    : undefined;
  const externalId = input.externalId
    ? [hashMetaUserValue(input.externalId)]
    : undefined;

  return omitEmpty({
    em,
    ph,
    external_id: externalId,
    fbp: input.fbp,
    fbc: input.fbc,
    client_ip_address: input.clientIpAddress,
    client_user_agent: input.clientUserAgent,
  });
};

export const buildMetaCapiPayload = (input: SendMetaCapiEventInput) => {
  const customData = input.customData
    ? omitEmpty({ ...input.customData })
    : undefined;

  return {
    data: [
      omitEmpty({
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: buildMetaCapiUserData(input.userData),
        custom_data: customData,
      }),
    ],
  };
};

export const getMetaCapiRequestContext = (
  request: Request,
): Pick<
  MetaCapiUserDataInput,
  "fbp" | "fbc" | "clientIpAddress" | "clientUserAgent"
> => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    const name = trimmed.slice(0, separator);
    cookies[name] = trimmed.slice(separator + 1);
  }

  return {
    fbp: cookies._fbp,
    fbc: cookies._fbc,
    clientIpAddress:
      firstHeaderValue(request.headers.get("x-real-ip")) ||
      firstHeaderValue(request.headers.get("cf-connecting-ip")) ||
      firstHeaderValue(request.headers.get("x-forwarded-for")),
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
  };
};

const getCapiToken = () => process.env.META_CAPI_ACCESS_TOKEN?.trim() || "";

export const sendMetaCapiEvent = async (
  input: SendMetaCapiEventInput,
): Promise<{ skipped: boolean }> => {
  const pixelId = getMetaPixelId();
  const token = getCapiToken();
  if (!pixelId || !token) return { skipped: true };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildMetaCapiPayload(input)),
        signal: AbortSignal.timeout(CAPI_TIMEOUT_MS),
      },
    );
    if (!response.ok) {
      console.error("Meta CAPI request failed", { status: response.status });
    }
  } catch {
    console.error("Meta CAPI request failed");
  }

  return { skipped: false };
};

export const scheduleMetaCapiEvent = (input: SendMetaCapiEventInput) => {
  try {
    after(() => sendMetaCapiEvent(input));
  } catch {
    void sendMetaCapiEvent(input);
  }
};
