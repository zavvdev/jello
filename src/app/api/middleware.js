import { usersRepo } from "~/infra/repositories/users";
import { API_AUTH_HEADER, API_MESSAGES, ERROR_RESPONSE } from "./config";

/**
 * @param {Request} request
 * @param {(user: import("yup").InferType<typeof import("~/entity/user").UserSchema>) => any} executor
 */
export async function withAuth(request, executor) {
  var token = request.headers.get(API_AUTH_HEADER);

  if (token) {
    var user = await usersRepo.getBySessionToken({ token });
    if (user) {
      return await executor(user);
    }
  }

  return ERROR_RESPONSE({ message: API_MESSAGES.unauthorized, status: 401 });
}
