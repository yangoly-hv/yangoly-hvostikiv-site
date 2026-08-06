import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getRequiredEnv } from "@/shared/lib/env.server";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

const ABANDONED_ORDER_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;
const MAX_ORDERS_PER_RUN = 100;

const abandonedOrdersQuery = `
  *[
    _type == "donateOrder" &&
    origin == "checkout" &&
    paymentStatus == "created" &&
    (!defined(callbackDeliveryCount) || callbackDeliveryCount == 0) &&
    dateTime(createdAt) < dateTime($before)
  ] | order(createdAt asc)[0...${MAX_ORDERS_PER_RUN}]._id
`;

const hasValidCronSecret = (request: Request, secret: string) => {
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBuffer = Buffer.from(secret, "utf8");
  const providedBuffer = Buffer.from(provided, "utf8");
  return (
    expectedBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  );
};

export async function GET(request: Request) {
  try {
    const secret = getRequiredEnv("CRON_SECRET");
    if (!hasValidCronSecret(request, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentsClient = getPaymentsClient();
    const before = new Date(Date.now() - ABANDONED_ORDER_RETENTION_MS).toISOString();
    const orderIds = await paymentsClient.fetch<string[]>(abandonedOrdersQuery, { before });

    if (orderIds.length === 0) {
      return NextResponse.json({ deleted: 0 });
    }

    const transaction = paymentsClient.transaction();
    orderIds.forEach((id) => transaction.delete(id));
    await transaction.commit();

    console.info("WayForPay abandoned orders cleanup", { deleted: orderIds.length });
    return NextResponse.json({ deleted: orderIds.length });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
      return NextResponse.json({ error: "Cleanup is not configured" }, { status: 503 });
    }

    console.error("WayForPay abandoned orders cleanup failed");
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
