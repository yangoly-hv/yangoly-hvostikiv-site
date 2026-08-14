import type { ContactRequestSource, ContactRequestValues } from "../model/schema";

export type ContactMessageRequest = ContactRequestValues & {
  source: ContactRequestSource;
};

type ContactMessageResponse = {
  success: boolean;
  error?: string;
  eventId?: string;
};

const isContactMessageResponse = (value: unknown): value is ContactMessageResponse =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { success?: unknown }).success === "boolean" &&
      ((value as { error?: unknown }).error === undefined ||
        typeof (value as { error?: unknown }).error === "string") &&
      ((value as { eventId?: unknown }).eventId === undefined ||
        typeof (value as { eventId?: unknown }).eventId === "string"),
  );

export async function sendContactMessage(
  payload: ContactMessageRequest,
): Promise<string | undefined> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const responseBody: unknown = await response.json().catch(() => null);
  const result = isContactMessageResponse(responseBody) ? responseBody : null;

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.error || "CONTACT_SEND_FAILED");
  }

  return result.eventId;
}
