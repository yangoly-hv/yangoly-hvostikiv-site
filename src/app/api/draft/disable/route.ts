import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { isAppLocale } from "@/shared/config/site";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "uk";
  (await draftMode()).disable();
  return NextResponse.redirect(
    new URL(`/${isAppLocale(locale) ? locale : "uk"}`, request.url)
  );
}
