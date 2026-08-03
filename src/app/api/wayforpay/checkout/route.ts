import { NextResponse } from "next/server";
import crypto from "crypto";
import * as yup from "yup";

import client from "@/shared/lib/sanity";
import { getRequiredEnv } from "@/shared/lib/env.server";

const checkoutBodySchema = yup
    .object({
        amount: yup.number().positive().required(),
        orderReference: yup.string().trim().required(),
        productName: yup.string().trim().required(),
        returnPath: yup.string().optional(),
    })
    .noUnknown();

export async function POST(req: Request) {
    try {
        const body = await checkoutBodySchema.validate(await req.json(), {
            abortEarly: false,
            stripUnknown: true,
        });
        const { amount, orderReference, productName, returnPath } = body;

        const merchantAccount = getRequiredEnv("WAYFORPAY_ACCOUNT");
        const merchantSecretKey = getRequiredEnv("WAYFORPAY_SECRET");
        const merchantDomainName = getRequiredEnv("WAYFORPAY_DOMAIN");
        const baseUrl = getRequiredEnv("NEXT_PUBLIC_BASE_URL");

        if (!amount || amount <= 0 || !orderReference || !productName) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const orderDate = Math.floor(Date.now() / 1000);

        const safeReturnPath =
            typeof returnPath === "string" && returnPath.startsWith("/")
                ? returnPath
                : "/";

        await client.create({
            _type: "donateOrder",
            orderReference,
            returnPath: safeReturnPath,
            createdAt: new Date().toISOString(),
        });

        const returnUrl = `${baseUrl}/api/wayforpay/return`;

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
            returnUrl,
            serviceUrl: `${baseUrl}/api/wayforpay/callback`,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        if (error instanceof Error && error.message.startsWith("Missing required environment variable:")) {
            return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
