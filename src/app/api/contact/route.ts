import { NextResponse } from "next/server";
import axios from "axios";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, phone, message } = await req.json();

        /* ---------- EMAIL (RESEND) ---------- */
        await resend.emails.send({
            from: `Благодійний фонд "Янголи хвостіків" <no-reply@angelsua.org>`,
            // to: ["angelsuaorg@gmail.com"],
            to: ["bogdan.lyamzin.d@gmail.com"],
            subject: "Нове повідомлення з сайту",
            html: `
        <p><b>Імʼя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Повідомлення:</b><br/>${message}</p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("CONTACT FORM ERROR:", error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
