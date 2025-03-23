import { MESSAGES } from "jello-messages";
import { MiddlewareError } from "jello-utils";
import { ERROR_RESPONSE } from "~/app/api/config";

/**
 * @param {Request} request
 * @param {(user: import("yup").InferType<typeof import("~/entity/user").UserSchema>) => any} executor
 */
export async function withSession(request) {
  try {
    var token =
      request.headers.get(process.env.API_AUTH_HEADER) || "";

    if (token && typeof token === "string" && token.length > 0) {
      return token;
    } else {
      throw new Error();
    }
  } catch {
    throw new MiddlewareError(
      "Session Middleware Error",
      ERROR_RESPONSE({
        message: MESSAGES.unauthorized,
        status: 401,
      }),
    );
  }
}

/**
 * @param {Request} request
 */
export async function withRequestBody(request) {
  try {
    var body = await request.json();
    return body;
  } catch {
    throw new MiddlewareError(
      "Request Body Middleware Error",
      ERROR_RESPONSE(),
    );
  }
}

export async function withQueryParams(request) {
  try {
    var { searchParams } = new URL(request.url);
    return searchParams;
  } catch {
    throw new MiddlewareError(
      "Query Params Middleware Error",
      ERROR_RESPONSE(),
    );
  }
}
