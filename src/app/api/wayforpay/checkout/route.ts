import { NextResponse } from "next/server";
import crypto from "crypto";

import client from "@/shared/lib/sanity";

const merchantAccount = process.env.WAYFORPAY_ACCOUNT!;
const merchantSecretKey = process.env.WAYFORPAY_SECRET!;
const merchantDomainName = process.env.WAYFORPAY_DOMAIN!;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

type CheckoutBody = {
    amount: number;
    orderReference: string;
    productName: string;
    returnPath?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CheckoutBody;
        const { amount, orderReference, productName, returnPath } = body;

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
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
