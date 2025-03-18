import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES } from "~/app/i18n/config";
import {
  isPrivateRoute,
  makeFullAppUrl,
  PRIVATE_ROUTES,
  PUBLIC_ROUTES,
} from "~/app/routes";
import { getLangFromPathname } from "~/app/i18n/utils";

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
    },
  ],
};

export async function middleware(request) {
  var { pathname } = request.nextUrl;
  var lang = getLangFromPathname(pathname);
  var cookieToken = (await cookies()).get(
    process.env.AUTH_COOKIE_NAME,
  )?.value;

  if (!isPrivateRoute(pathname) && cookieToken) {
    return NextResponse.redirect(
      makeFullAppUrl(PRIVATE_ROUTES.dashboard(), lang),
    );
  }

  if (isPrivateRoute(pathname) && !cookieToken) {
    return NextResponse.redirect(
      makeFullAppUrl(PUBLIC_ROUTES.auth.login(), lang),
    );
  }

  return i18nRouter(request, {
    locales: Object.values(LOCALES),
    defaultLocale: DEFAULT_LOCALE,
  });
}
