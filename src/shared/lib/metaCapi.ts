import "server-only";

import { createHash } from "node:crypto";
import { after } from "next/server";

import { getMetaClickIds } from "@/shared/lib/metaClickIds";
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

const headerValues = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const isIPv6 = (ip: string) => ip.includes(":") && !ip.toLowerCase().startsWith("::ffff:");

const ipv4Octets = (ip: string) => {
  const parts = ip.split(".");
  if (parts.length !== 4) return undefined;
  const octets = parts.map((part) => Number(part));
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return undefined;
  }
  return octets;
};

const isLoopbackLinkLocalOrPrivate = (ip: string) => {
  const lower = ip.toLowerCase();
  if (ip.includes(":")) {
    return (
      lower === "::1" ||
      lower === "::" ||
      lower.startsWith("fe8") ||
      lower.startsWith("fe9") ||
      lower.startsWith("fea") ||
      lower.startsWith("feb") ||
      lower.startsWith("fc") ||
      lower.startsWith("fd")
    );
  }

  const octets = ipv4Octets(ip);
  if (!octets) return true;
  const first = octets[0];
  const second = octets[1];
  if (first === 10 || first === 127 || first === 0) return true;
  if (first === 192 && second === 168) return true;
  if (first === 172 && second !== undefined && second >= 16 && second <= 31) return true;
  if (first === 169 && second === 254) return true;
  return false;
};

export const pickClientIpAddress = (request: Request) => {
  const candidates = [
    ...headerValues(request.headers.get("x-forwarded-for")),
    ...headerValues(request.headers.get("x-real-ip")),
    ...headerValues(request.headers.get("cf-connecting-ip")),
  ];
  const publicIps = candidates.filter((ip) => !isLoopbackLinkLocalOrPrivate(ip));
  const pool =
    publicIps.length > 0
      ? publicIps
      : candidates.filter((ip) => {
          const lower = ip.toLowerCase();
          return lower !== "127.0.0.1" && lower !== "::1" && lower !== "::";
        });
  return pool.find((ip) => isIPv6(ip)) ?? pool[0];
};

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
  const { fbp, fbc } = getMetaClickIds({
    cookieHeader: request.headers.get("cookie") ?? "",
    href: "",
  });

  return {
    fbp,
    fbc,
    clientIpAddress: pickClientIpAddress(request),
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
      console.error("Meta CAPI request failed", {
        eventName: input.eventName,
        status: response.status,
      });
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
