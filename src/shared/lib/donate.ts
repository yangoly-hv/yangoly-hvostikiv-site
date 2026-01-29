"use client";

import axios from "axios";

type DonateParams = {
    amount: number;
    productName?: string;
    returnPath: string;
    comment?: string;
};

const donate = async ({amount, productName = "Донат для фонду Янголи хвостиків", comment, returnPath}: DonateParams)=> {
    try {
        const { data } = await axios.post("/api/wayforpay/checkout", {
            amount,
            orderReference: `DONATE_${Date.now()}`,
            productName,
            comment,
            returnPath,
        });

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://secure.wayforpay.com/pay";

        Object.entries(data).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = Array.isArray(value) ? value.join(";") : String(value);
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        console.error("WayForPay checkout error:", error);
    }
}

export default donate;
