import { NextResponse } from "next/server";
import crypto from "crypto";

const merchantAccount = process.env.WAYFORPAY_ACCOUNT!;
const merchantSecretKey = process.env.WAYFORPAY_SECRET!;
const merchantDomainName = process.env.WAYFORPAY_DOMAIN!;

export async function POST(req: Request) {
    const body = await req.json();
    const { amount, orderReference, productName } = body;

    const orderDate = Math.floor(Date.now() / 1000);

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

    const paymentData = {
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
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/success`,
        serviceUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/wayforpay/callback`,
    };

    return NextResponse.json(paymentData);
}
