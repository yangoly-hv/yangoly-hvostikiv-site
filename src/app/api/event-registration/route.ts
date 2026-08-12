import { NextResponse } from "next/server";

import { eventRegistrationSubmissionSchema } from "@/features/event-registration/model/schema";
import {
  appendRegistrationRow,
  SheetsAppendError,
  SheetsUnavailableError,
} from "@/features/event-registration/server/appendRegistrationRow";
import { checkEventRegistrationRateLimit } from "./rateLimit";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const rateLimit = await checkEventRegistrationRateLimit(request);
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
      { status: 400 },
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

  const parsedInput = eventRegistrationSubmissionSchema.safeParse(input);
  if (!parsedInput.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  try {
    await appendRegistrationRow(parsedInput.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SheetsUnavailableError) {
      return NextResponse.json(
        { success: false, error: "SHEETS_UNAVAILABLE" },
        { status: 503 },
      );
    }

    if (error instanceof SheetsAppendError) {
      return NextResponse.json(
        { success: false, error: "SHEETS_APPEND_FAILED" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
