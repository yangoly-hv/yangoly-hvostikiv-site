import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { isAppLocale } from "@/shared/config/site";

const previewTypes = new Set(["blog", "tails", "reporting"]);

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const locale = request.nextUrl.searchParams.get("locale") || "uk";
  const type = request.nextUrl.searchParams.get("type");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!process.env.DRAFT_PREVIEW_SECRET || secret !== process.env.DRAFT_PREVIEW_SECRET) {
    return NextResponse.json({ enabled: false }, { status: 401 });
  }

  if (!isAppLocale(locale) || !type || !previewTypes.has(type) || !slug) {
    return NextResponse.json({ enabled: false }, { status: 400 });
  }

  (await draftMode()).enable();
  return NextResponse.redirect(
    new URL(
      `/${locale}/preview/${type}/${encodeURIComponent(slug)}`,
      request.url
    )
  );
}
