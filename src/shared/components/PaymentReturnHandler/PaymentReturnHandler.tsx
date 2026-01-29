"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/providers/ModalProvider";

export default function PaymentReturnHandler() {
    const pathname = usePathname();
    const { openThankYouModal } = useModal();

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!pathname) return;

        const search = window.location.search;
        if (!search) return;

        const params = new URLSearchParams(search);

        const payment = params.get("payment");
        const orderReference = params.get("orderReference");

        if (payment === "success" && orderReference) {
            // ✅ открываем thank you
            openThankYouModal();

            // 🧹 чистим URL
            params.delete("payment");
            params.delete("orderReference");

            const cleanedQuery = params.toString();
            const nextUrl = cleanedQuery
                ? `${pathname}?${cleanedQuery}`
                : pathname;

            window.history.replaceState(null, "", nextUrl);
        }
    }, [pathname, openThankYouModal]);

    return null;
}
