import { UserSchema } from "~/entity/user";
import { usersRepo } from "~/infra/repositories/users";
import {
  API_AUTH_HEADER,
  API_MESSAGES,
  ERROR_RESPONSE,
} from "~/app/api/config";

/**
 * @param {Request} request
 * @param {(user: import("yup").InferType<typeof import("~/entity/user").UserSchema>) => any} executor
 */
export async function withAuth(request, executor) {
  try {
    var token = request.headers.get(API_AUTH_HEADER);

    if (token) {
      var user = await usersRepo.getBySessionToken({ token });
      if (user) {
        return await executor(UserSchema.validateSync(user, { strict: true }));
      }
    } else {
      throw new Error();
    }
  } catch {
    return ERROR_RESPONSE({ message: API_MESSAGES.unauthorized, status: 401 });
  }
}
