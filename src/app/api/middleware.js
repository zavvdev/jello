import { UserSchema } from "~/entity/user";
import { usersRepo } from "~/infra/repositories/users";
import { API_MESSAGES, ERROR_RESPONSE } from "~/app/api/config";

/**
 * @param {Request} request
 * @param {(user: import("yup").InferType<typeof import("~/entity/user").UserSchema>) => any} executor
 */
export async function withAuth(request, executor) {
  try {
    var token = request.headers.get(process.env.API_AUTH_HEADER) || "";
    var user = await usersRepo.getBySessionToken({ token });

    if (user) {
      return await executor(UserSchema.validateSync(user, { strict: true }));
    } else {
      throw new Error();
    }
  } catch {
    return ERROR_RESPONSE({ message: API_MESSAGES.unauthorized, status: 401 });
  }
}
