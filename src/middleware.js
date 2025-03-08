import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "~/app/i18n/config";
import { appUrl } from "~/app/routes";
import { getLangFromPathname } from "~/app/i18n/utils";

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
    },
  ],
};

export async function middleware(request) {
  var { pathname } = request.nextUrl;
  var lang = getLangFromPathname(pathname);

  try {
    // I18n

    if (pathname.includes("/static/")) {
      return;
    }

    var pathnameHasLocale = Object.values(LOCALES).some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (pathnameHasLocale) {
      return;
    }

    request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;

    return NextResponse.redirect(request.nextUrl);
  } catch {
    return NextResponse.redirect(appUrl("/", lang));
  }
}
