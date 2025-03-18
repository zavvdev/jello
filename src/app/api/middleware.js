import { MESSAGES } from "jello-messages";
import { ERROR_RESPONSE } from "~/app/api/config";

/**
 * @param {Request} request
 * @param {(user: import("yup").InferType<typeof import("~/entity/user").UserSchema>) => any} executor
 */
export async function withSession(request, executor) {
  try {
    var token =
      request.headers.get(process.env.API_AUTH_HEADER) || "";

    if (token && typeof token === "string" && token.length > 0) {
      return await executor(token);
    } else {
      throw new Error();
    }
  } catch {
    return ERROR_RESPONSE({
      message: MESSAGES.unauthorized,
      status: 401,
    });
  }
}
