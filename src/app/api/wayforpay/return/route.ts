import { NextResponse } from "next/server";

import { isDonateOrderReference } from "@/features/donation/server/wayforpay";
import { getRequiredEnv } from "@/shared/lib/env.server";
import legacyClient from "@/shared/lib/sanity";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

const MAX_RETURN_BODY_BYTES = 8 * 1024;
const returnPathQuery = `*[_type == "donateOrder" && orderReference == $orderReference][0]{ returnPath }`;

type ReturnOrder = { returnPath?: string };

const getSafeReturnPath = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : "/";

const readOrderReference = async (request: Request) => {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_RETURN_BODY_BYTES) return null;
  if (request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
    const formData = await request.formData();
    const value = formData.get("orderReference");
    return typeof value === "string" ? value : null;
  }
  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_RETURN_BODY_BYTES) return null;
  return new URLSearchParams(body).get("orderReference");
};

export async function POST(request: Request) {
  let baseUrl: string;
  try {
    baseUrl = getRequiredEnv("NEXT_PUBLIC_BASE_URL");
  } catch {
    return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
  }

  const orderReference = await readOrderReference(request);
  if (!orderReference || !isDonateOrderReference(orderReference)) {
    return NextResponse.redirect(new URL("/", baseUrl), 302);
  }

  try {
    const paymentsClient = getPaymentsClient();
    const order = await paymentsClient.fetch<ReturnOrder | null>(returnPathQuery, { orderReference })
      ?? await legacyClient.fetch<ReturnOrder | null>(returnPathQuery, { orderReference });
    if (!order) return NextResponse.redirect(new URL("/", baseUrl), 302);

    const redirectUrl = new URL(getSafeReturnPath(order.returnPath), baseUrl);
    redirectUrl.searchParams.set("payment", "processing");
    redirectUrl.searchParams.set("orderReference", orderReference);
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error("WayForPay return order lookup failed", { orderReference });
    return NextResponse.json(
      { error: error instanceof Error && error.message.startsWith("Missing required environment variable:") ? "Payment is not configured" : "Payment return is unavailable" },
      { status: error instanceof Error && error.message.startsWith("Missing required environment variable:") ? 503 : 500 },
    );
  }
}
