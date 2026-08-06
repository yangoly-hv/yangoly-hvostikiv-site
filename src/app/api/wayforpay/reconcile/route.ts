import crypto from "node:crypto";

import { NextResponse } from "next/server";

import {
  parseWayforpayCallback,
  verifyCallbackSignature,
} from "@/features/donation/server/wayforpay";
import { processPendingPaymentEffects } from "@/features/donation/server/paymentEffects";
import { getRequiredEnv } from "@/shared/lib/env.server";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

import { persistCallback } from "../callback/route";

const WAYFORPAY_API_URL = "https://api.wayforpay.com/api";
const RECONCILIATION_DELAY_MS = 15 * 60 * 1_000;
const MAX_ORDERS_PER_RUN = 50;
const MAX_EFFECTS_PER_RUN = 50;

const reconciliationCandidatesQuery = `
  *[
    _type == "donateOrder" &&
    origin == "checkout" &&
    paymentStatus in ["created", "pending", "unknown"] &&
    dateTime(createdAt) < dateTime($before)
  ] | order(createdAt asc)[0...${MAX_ORDERS_PER_RUN}]{ orderReference }
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

const createCheckStatusSignature = (merchantAccount: string, orderReference: string, secret: string) =>
  crypto.createHmac("md5", secret).update(`${merchantAccount};${orderReference}`, "utf8").digest("hex");

type ReconciliationCandidate = { orderReference: string };

export async function GET(request: Request) {
  try {
    const cronSecret = getRequiredEnv("CRON_SECRET");
    if (!hasValidCronSecret(request, cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const merchantAccount = getRequiredEnv("WAYFORPAY_ACCOUNT");
    const merchantSecret = getRequiredEnv("WAYFORPAY_SECRET");
    const encryptionKey = getRequiredEnv("PAYMENTS_ENCRYPTION_KEY");
    const paymentsClient = getPaymentsClient();
    const before = new Date(Date.now() - RECONCILIATION_DELAY_MS).toISOString();
    const candidates = await paymentsClient.fetch<ReconciliationCandidate[]>(
      reconciliationCandidatesQuery,
      { before },
    );

    let reconciled = 0;
    let failed = 0;
    for (const { orderReference } of candidates) {
      try {
        const response = await fetch(WAYFORPAY_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionType: "CHECK_STATUS",
            merchantAccount,
            orderReference,
            merchantSignature: createCheckStatusSignature(merchantAccount, orderReference, merchantSecret),
            apiVersion: 1,
          }),
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`WayForPay CHECK_STATUS returned ${response.status}`);

        const payload = parseWayforpayCallback(await response.json());
        if (
          payload.merchantAccount !== merchantAccount ||
          payload.orderReference !== orderReference ||
          !verifyCallbackSignature(payload, merchantSecret)
        ) {
          throw new Error("WayForPay CHECK_STATUS response failed verification");
        }

        await persistCallback({ payload, encryptionKey, source: "reconciliation" });
        reconciled += 1;
        console.info("WayForPay reconciliation", {
          result: "reconciled",
          orderReference,
          transactionStatus: payload.transactionStatus,
          reasonCode: payload.reasonCode,
        });
      } catch {
        failed += 1;
        console.info("WayForPay reconciliation", { result: "failed", orderReference });
      }
    }

    const effects = await processPendingPaymentEffects(MAX_EFFECTS_PER_RUN);
    console.info("WayForPay effects", effects);

    return NextResponse.json({
      checked: candidates.length,
      reconciled,
      failed,
      effects,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
      return NextResponse.json({ error: "Reconciliation is not configured" }, { status: 503 });
    }

    console.error("WayForPay reconciliation failed");
    return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 });
  }
}
