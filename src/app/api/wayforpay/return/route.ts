import { NextResponse } from "next/server";
import client from "@/shared/lib/sanity";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(req: Request) {
    const formData = await req.formData();
    const orderReference = formData.get("orderReference");

    // safety fallback
    if (typeof orderReference !== "string") {
        return NextResponse.redirect(new URL("/", baseUrl), 302);
    }

    // 🔥 1. ищем сохранённый returnPath
    const query = `
    *[_type == "donateOrder" && orderReference == $orderReference][0]
  `;

    const order = await client.fetch(query, { orderReference });

    const returnPath =
        typeof order?.returnPath === "string"
            ? order.returnPath
            : "/";

    // 🔥 2. удаляем запись (одноразовая)
    if (order?._id) {
        await client.delete(order._id);
    }

    // 🔥 3. формируем redirect на ТУ ЖЕ страницу
    const redirectUrl =
        `${returnPath}` +
        (returnPath.includes("?") ? "&" : "?") +
        `payment=success&orderReference=${orderReference}`;

    return NextResponse.redirect(
        new URL(redirectUrl, baseUrl),
        302
    );
}
