import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { createCheckoutRequestSchema } from "@/features/donation/model/schema";
import type { DonationPurpose } from "@/features/donation/model/purpose";
import {
  getDonateOrderDocumentId,
  getNextMonthlyPaymentDate,
  moneyToMinor,
} from "@/features/donation/server/wayforpay";
import { getRequiredEnv } from "@/shared/lib/env.server";
import legacyClient from "@/shared/lib/sanity";
import { getPaymentsClient } from "@/shared/lib/sanity.payments";

import { checkCheckoutRateLimit } from "./rateLimit";

const MAX_REQUEST_BODY_BYTES = 8 * 1024;
const productName = "Charitable donation to Angels of Tails";

const collectionQuery = `
  *[_type == "collection" && _id == $targetId][0]{
    _id,
    "name": coalesce(title.uk, title.en)
  }
`;
const tailQuery = `*[_type == "tail" && _id == $targetId][0]{ _id, name, keeping_price }`;
const foundationDonationTargetName = "Підтримка роботи фонду";

type DonationTargetDocument = { _id: string; name?: string; keeping_price?: number };
type ResolvedDonationTarget = {
  donationTargetId?: string;
  donationTargetName: string;
  collectionId?: string;
  guardianshipAmount?: number;
};

class RequestBodyTooLargeError extends Error {}

const readJsonBody = async (request: Request): Promise<unknown> => {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    throw new RequestBodyTooLargeError();
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BODY_BYTES) {
    throw new RequestBodyTooLargeError();
  }

  return JSON.parse(body);
};

const isExpectedOrigin = (request: Request, baseUrl: string) => {
  const origin = request.headers.get("origin");
  return origin === new URL(baseUrl).origin;
};

const getSafeReturnPath = (value: unknown) =>
  typeof value === "string" &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.includes("\\")
    ? value
    : "/";

const resolveDonationTarget = async ({
  purpose,
  targetId,
}: {
  purpose: DonationPurpose;
  targetId?: string;
}): Promise<ResolvedDonationTarget | null> => {
  if (purpose === "foundation") {
    return { donationTargetName: foundationDonationTargetName };
  }

  const query = purpose === "collection" ? collectionQuery : tailQuery;
  const target = await legacyClient.fetch<DonationTargetDocument | null>(query, { targetId });
  if (!target || !target.name?.trim()) return null;

  return {
    donationTargetId: target._id,
    donationTargetName: target.name.trim(),
    ...(purpose === "collection" ? { collectionId: target._id } : {}),
    ...(purpose === "tail-guardianship" ? { guardianshipAmount: target.keeping_price } : {}),
  };
};

export async function POST(request: Request) {
  try {
    const merchantAccount = getRequiredEnv("WAYFORPAY_ACCOUNT");
    const merchantSecretKey = getRequiredEnv("WAYFORPAY_SECRET");
    const merchantDomainName = getRequiredEnv("WAYFORPAY_DOMAIN");
    const baseUrl = getRequiredEnv("NEXT_PUBLIC_BASE_URL");

    if (!isExpectedOrigin(request, baseUrl)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const rateLimit = checkCheckoutRateLimit(request);
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many checkout attempts" },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const parsedBody = createCheckoutRequestSchema.safeParse(await readJsonBody(request));
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const {
      amount,
      donationPurpose,
      donationTargetId,
      donationItemDescription,
      fullName,
      isAnonymous,
      comment,
      isAgreed,
      donationSchedule,
      isRecurringAgreed,
      returnPath,
    } = parsedBody.data;
    const donationTarget = await resolveDonationTarget({
      purpose: donationPurpose,
      targetId: donationTargetId,
    });
    if (!donationTarget) {
      return NextResponse.json({ error: "Unknown donation target" }, { status: 400 });
    }
    if (donationPurpose === "tail-guardianship") {
      const guardianshipAmount = donationTarget.guardianshipAmount;
      if (
        typeof guardianshipAmount !== "number" ||
        !Number.isFinite(guardianshipAmount) ||
        guardianshipAmount <= 0 ||
        moneyToMinor(guardianshipAmount) !== moneyToMinor(amount)
      ) {
        return NextResponse.json({ error: "Guardianship amount changed" }, { status: 409 });
      }
    }
    const orderReference = `DONATE_${crypto.randomUUID()}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const safeReturnPath = getSafeReturnPath(returnPath);
    const amountMinor = moneyToMinor(amount);
    const isMonthly = donationSchedule === "monthly";
    const dateNext = isMonthly ? getNextMonthlyPaymentDate() : undefined;
    const { guardianshipAmount: _guardianshipAmount, ...persistedDonationTarget } = donationTarget;

    await getPaymentsClient().create({
      _id: getDonateOrderDocumentId(orderReference),
      _type: "donateOrder",
      schemaVersion: 1,
      origin: "checkout",
      orderReference,
      amountMinor,
      expectedAmount: amount,
      currency: "UAH",
      productName,
      productCount: 1,
      paymentType: donationSchedule,
      orderDate,
      donationPurpose,
      ...persistedDonationTarget,
      ...(donationItemDescription ? { donationItemDescription } : {}),
      donationEmailEnabled: true,
      returnPath: safeReturnPath,
      comment,
      isAgreed,
      isRecurringAgreed,
      ...(isMonthly
        ? {
            regularMode: "monthly",
            regularAmountMinor: amountMinor,
            regularNextPaymentDate: dateNext,
          }
        : {}),
      isAnonymous,
      ...(!isAnonymous && fullName ? { donorFullName: fullName } : {}),
      wantNotifications: false,
      createdAt: new Date().toISOString(),
      paymentStatus: "created",
      callbackDeliveryCount: 0,
    });

    const signatureString = [
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      "UAH",
      productName,
      "1",
      amount,
    ].join(";");
    const merchantSignature = crypto
      .createHmac("md5", merchantSecretKey)
      .update(signatureString)
      .digest("hex");

    return NextResponse.json({
      merchantAccount,
      merchantDomainName,
      merchantSignature,
      orderReference,
      orderDate,
      amount,
      currency: "UAH",
      productName: [productName],
      productPrice: [amount],
      productCount: [1],
      returnUrl: `${baseUrl}/api/wayforpay/return`,
      serviceUrl: `${baseUrl}/api/wayforpay/callback`,
      ...(isMonthly
        ? {
            regularMode: "monthly",
            regularBehavior: "preset",
            regularOn: 1,
            regularAmount: amount,
            dateNext,
            paymentSystems: "card;googlePay;applePay",
          }
        : {}),
    });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
    }

    console.error("WayForPay checkout failed");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
