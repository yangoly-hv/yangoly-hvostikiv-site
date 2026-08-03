import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as yup from "yup";

const contactRequestSchema = yup
  .object({
    name: yup.string().trim().required().max(100),
    phone: yup
      .string()
      .trim()
      .required()
      .matches(/^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/),
    message: yup.string().trim().max(2000).default(""),
    requestLabel: yup.string().trim().required().max(120),
  })
  .noUnknown();

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!
  );

const normalizeRequestLabel = (value: string) =>
  value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 503 }
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  let contactRequest: yup.InferType<typeof contactRequestSchema>;
  try {
    contactRequest = await contactRequestSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        { success: false, error: "INVALID_INPUT" },
        { status: 400 }
      );
    }
    throw error;
  }

  const { name, phone, message, requestLabel } = contactRequest;
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message || "—").replace(/\r?\n/g, "<br/>");
  const safeRequestLabel = normalizeRequestLabel(requestLabel);
  const from =
    process.env.CONTACT_EMAIL_FROM ||
    `Благодійний фонд "Янголи хвостиків" <no-reply@angelsua.org>`;
  const to = process.env.CONTACT_EMAIL_TO || "angelsuaorg@gmail.com";

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      subject: `Повідомлення з сайту — ${safeRequestLabel}`,
      html: `
        <p><b>Ім’я:</b> ${safeName}</p>
        <p><b>Телефон:</b> ${safePhone}</p>
        <p><b>Повідомлення:</b><br/>${safeMessage}</p>
      `,
      text: `Ім’я: ${name}\nТелефон: ${phone}\nПовідомлення: ${message || "—"}`,
    });

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "EMAIL_SEND_FAILED" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
