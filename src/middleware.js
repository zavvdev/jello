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
import { PUBLIC_API_ROUTES } from "./app/api/config";

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|assets|favicon.ico|sw.js).*)",
    },
  ],
};

export async function middleware(request) {
  var { pathname } = request.nextUrl;
  var lang = getLangFromPathname(pathname);

  if (pathname.startsWith("/api")) {
    if (PUBLIC_API_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // TODO: Get token from cookies. Get token from request headers.
    // If request headers have an Auth token, attach it to the request.
    // If request headers don't have an Auth token, attach the cookie token to the request.
    // In protected routes read Authentication header for token.
  } else {
    try {
      // Auth

      var token = (await cookies()).get(process.env.COOKIE_NAME)?.value;

      if (!isPrivateRoute(pathname) && token) {
        return NextResponse.redirect(appUrl(PRIVATE_ROUTES.dashboard(), lang));
      }

      if (isPrivateRoute(pathname) && !token) {
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
}
