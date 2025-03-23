import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["uk", "en"];
const defaultLocale = "uk";
const LOCALE_COOKIE = "NEXT_LOCALE";

function getLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const browserLocales = acceptLanguage
    .split(",")
    .map((locale) => locale.split(";")[0].substring(0, 2));

  return (
    browserLocales.find((locale) => locales.includes(locale)) || defaultLocale
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  // Перевіряємо, чи є локаль у шляху
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Отримуємо локаль із cookie або заголовків
  const locale =
    savedLocale && locales.includes(savedLocale)
      ? savedLocale
      : getLocaleFromHeader(request);

  // Якщо локаль є в шляху, але вона не збігається з локаллю з cookie, перенаправляємо
  if (
    pathnameHasLocale &&
    savedLocale &&
    savedLocale !== pathname.split("/")[1]
  ) {
    const newPathname = pathname.replace(/^\/[^/]+/, `/${savedLocale}`);
    console.log(`Redirecting to: ${newPathname} (based on cookie)`);
    const response = NextResponse.redirect(new URL(newPathname, request.url));
    response.cookies.set(LOCALE_COOKIE, savedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // Якщо локалі немає в шляху, додаємо локаль із cookie або заголовків
  if (!pathnameHasLocale) {
    const newPath = `/${locale}${pathname || "/"}`;
    const response = NextResponse.redirect(new URL(newPath, request.url));
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // Якщо все збігається, просто продовжуємо
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
