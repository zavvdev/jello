import "server-only";

import { usersRepo } from "~/infra/repositories/public/users";
import { sessionsRepo } from "~/infra/repositories/public/sessions";
import { handleKnownError as _ } from "~/domain/utilities/error-handling";
import { LOGIN_ERROR_KEYS as ERROR_KEYS } from "./config";

/**
 * @param {{
 *  usernameOrEmail: string,
 *  password: string,
 * }} param0
 */
export async function login({ usernameOrEmail, password }) {
  return await _(
    ERROR_KEYS,
    async () => {
      var user = await usersRepo.getByCredentials({
        usernameOrEmail,
        password,
      });

      if (!user) {
        throw new Error(ERROR_KEYS.userNotFound);
      }

      await sessionsRepo.create({
        user_id: user.id,
      });
    },
    "domain/login",
  );
}
