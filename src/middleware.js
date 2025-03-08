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
    // Auth

    // TODO: Next is crushing here

    // var session = await getSession();

    // if (!isPrivateRoute(pathname) && session) {
    //   return NextResponse.redirect(appUrl(PRIVATE_ROUTES.dashboard(), lang));
    // }
    //
    // if (isPrivateRoute(pathname) && !session) {
    //   throw new Error("unauthorized");
    // }

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
