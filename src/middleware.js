import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES } from "~/app/i18n/config";
import {
  appUrl,
  isPrivateRoute,
  PRIVATE_ROUTES,
  PUBLIC_ROUTES,
} from "~/app/routes";
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
  var cookieToken = (await cookies()).get(process.env.COOKIE_NAME)?.value;

  try {
    // Auth

    if (!isPrivateRoute(pathname) && cookieToken) {
      return NextResponse.redirect(appUrl(PRIVATE_ROUTES.dashboard(), lang));
    }

    if (isPrivateRoute(pathname) && !cookieToken) {
      return NextResponse.redirect(appUrl(PUBLIC_ROUTES.auth.login(), lang));
    }

    // I18n

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
