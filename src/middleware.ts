import { NextRequest, NextResponse } from "next/server";

import { i18n } from "./configs/i18n.config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages().filter((lang) => lang !== "*");

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export const middleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  const locale = getLocale(req);

  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    response.cookies.set("collaborator", code);
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const redirectUrl = new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, req.url);
    redirectUrl.search = req.nextUrl.search; // Preserva los query params
    return NextResponse.redirect(redirectUrl);
  }

  return response;
};

export const config = {
  matcher: ["/((?!studio|api|_next/static|_next/image|favicon.ico).*)"],
};
