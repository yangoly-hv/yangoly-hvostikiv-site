import { NextResponse } from "next/server";

import { isDonateOrderReference, minorToMoney } from "@/features/donation/server/wayforpay";
import { isPaymentStatus, type PaymentStatus } from "@/features/donation/model/payment";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";
import { checkStatusRateLimit } from "../checkout/rateLimit";

const orderStatusQuery = `
  *[_type == "donateOrder" && orderReference == $orderReference][0]{
    paymentStatus,
    amountMinor,
    currency,
    donationPurpose,
    donationTargetName
  }
`;

const noStoreHeaders = { "Cache-Control": "no-store" };

const sanitizeShortLabel = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > maxLength) return undefined;
  return trimmed;
};

type OrderStatusRecord = {
  paymentStatus?: PaymentStatus;
  amountMinor?: number;
  currency?: string;
  donationPurpose?: string;
  donationTargetName?: string;
};

export async function GET(request: Request) {
  const rateLimit = checkStatusRateLimit(request);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many status checks" },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }
  const orderReference = new URL(request.url).searchParams.get("orderReference");
  if (!orderReference || !isDonateOrderReference(orderReference)) {
    return NextResponse.json({ error: "Invalid order reference" }, { status: 400, headers: noStoreHeaders });
  }

  try {
    const order = await getPaymentsClient().fetch<OrderStatusRecord | null>(
      orderStatusQuery,
      { orderReference },
    );
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404, headers: noStoreHeaders });
    }

    const status = isPaymentStatus(order.paymentStatus ?? "created")
      ? (order.paymentStatus ?? "created")
      : "unknown";

    if (
      status === "approved" &&
      typeof order.amountMinor === "number" &&
      Number.isSafeInteger(order.amountMinor) &&
      order.amountMinor > 0 &&
      typeof order.currency === "string" &&
      /^[A-Z]{3}$/.test(order.currency)
    ) {
      const purpose = sanitizeShortLabel(order.donationPurpose, 64);
      const name = sanitizeShortLabel(order.donationTargetName, 100);

      return NextResponse.json(
        {
          status,
          value: Number(minorToMoney(order.amountMinor)),
          currency: order.currency,
          ...(purpose ? { purpose } : {}),
          ...(name ? { name } : {}),
        },
        { headers: noStoreHeaders },
      );
    }

    return NextResponse.json({ status }, { headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503, headers: noStoreHeaders });
    }

    console.error("WayForPay payment status lookup failed", { orderReference });
    return NextResponse.json({ error: "Payment status is unavailable" }, { status: 500, headers: noStoreHeaders });
  }
}
