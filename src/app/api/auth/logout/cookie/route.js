import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import queryString from "query-string";
import { API_ROUTES, ERROR_RESPONSE } from "~/app/api/config";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  try {
    var cookiesStore = await cookies();
    var queryParams = queryString.parse(request.url.split("?")[1] || "");
    var redirectUrl = queryParams.redirect_to;

    await fetch(API_ROUTES.auth.logout.root(), {
      method: "POST",
      body: JSON.stringify({
        token: cookiesStore.get(process.env.AUTH_COOKIE_NAME)?.value,
      }),
    });

    var nextResponse = NextResponse.redirect(redirectUrl);
    nextResponse.cookies.delete(process.env.AUTH_COOKIE_NAME);
    return nextResponse;
  } catch {
    return ERROR_RESPONSE();
  }
}
