import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  contactSubmissionSchema,
  type ContactRequestSource,
} from "@/features/contact-request/model/schema";
import { checkContactRequestRateLimit } from "./rateLimit";

const MAX_REQUEST_BODY_BYTES = 8 * 1024;

class RequestBodyTooLargeError extends Error {}

const readJsonBody = async (request: Request): Promise<unknown> => {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    throw new RequestBodyTooLargeError();
  }

  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > MAX_REQUEST_BODY_BYTES) {
        throw new RequestBodyTooLargeError();
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(body);
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!
  );

const sourceLabels: Record<ContactRequestSource, string> = {
  "contact-page": "Зворотній зв'язок",
  partnership: "Партнерство",
  volunteering: "Волонтерство",
  "event-partnership": "Партнерство",
  "event-ambassador": "Амбасадорство",
  "event-volunteering": "Волонтерство",
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 503 }
    );
  }

  try {
    const rateLimit = await checkContactRequestRateLimit(request);
    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, error: "RATE_LIMITED" },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "RATE_LIMIT_UNAVAILABLE" },
      { status: 503 },
    );
  }

  let input: unknown;
  try {
    input = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { success: false, error: "PAYLOAD_TOO_LARGE" },
        { status: 413 },
      );
    }

    return NextResponse.json(
      { success: false, error: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  if (
    input &&
    typeof input === "object" &&
    typeof (input as { website?: unknown }).website === "string" &&
    (input as { website: string }).website.trim() !== ""
  ) {
    return NextResponse.json({ success: true });
  }

  const parsedInput = contactSubmissionSchema.safeParse(input);
  if (!parsedInput.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  const { name, phone, message, source } = parsedInput.data;
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message || "—").replace(/\r?\n/g, "<br/>");
  const safeRequestLabel = sourceLabels[source];
  const from =
    process.env.CONTACT_EMAIL_FROM ||
    `Благодійний фонд "Янголи хвостиків" <no-reply@angelsua.org>`;
  const to = process.env.CONTACT_EMAIL_TO || "angelsuaorg@gmail.com";

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      subject: `Новий лист з сайту — ${safeRequestLabel}`,
      html: `
        <p><b>Тип звернення:</b> ${safeRequestLabel}</p>
        <p><b>Ім’я:</b> ${safeName}</p>
        <p><b>Телефон:</b> ${safePhone}</p>
        <p><b>Повідомлення:</b><br/>${safeMessage}</p>
      `,
      text: `Тип звернення: ${safeRequestLabel}\nІм’я: ${name}\nТелефон: ${phone}\nПовідомлення: ${message || "—"}`,
    });

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "EMAIL_SEND_FAILED" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
