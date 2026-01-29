"use client";

import dynamic from "next/dynamic";

const PaymentReturnHandler = dynamic(
    () =>
        import(
            "@/shared/components/PaymentReturnHandler/PaymentReturnHandler"
            ),
    { ssr: false }
);

export default function PaymentReturnClient() {
    return <PaymentReturnHandler />;
}
