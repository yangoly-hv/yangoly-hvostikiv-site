import type {
  EventRegistrationFormValues,
  EventRegistrationLocale,
} from "../model/schema";

export type EventRegistrationRequest = EventRegistrationFormValues & {
  locale: EventRegistrationLocale;
};

type EventRegistrationResponse = {
  success: boolean;
  error?: string;
  eventId?: string;
};

const isEventRegistrationResponse = (
  value: unknown,
): value is EventRegistrationResponse =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { success?: unknown }).success === "boolean" &&
      ((value as { error?: unknown }).error === undefined ||
        typeof (value as { error?: unknown }).error === "string") &&
      ((value as { eventId?: unknown }).eventId === undefined ||
        typeof (value as { eventId?: unknown }).eventId === "string"),
  );

export async function submitRegistration(
  payload: EventRegistrationRequest,
): Promise<string | undefined> {
  const response = await fetch("/api/event-registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const responseBody: unknown = await response.json().catch(() => null);
  const result = isEventRegistrationResponse(responseBody) ? responseBody : null;

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.error || "EVENT_REGISTRATION_FAILED");
  }

  return result.eventId;
}
