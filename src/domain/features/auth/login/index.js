import "server-only";

import { usersRepo } from "~/infra/database/repos/users-repo";
import { sessionsRepo } from "~/infra/database/repos/sessions-repo";
import { createSessionToken } from "~/infra/encryption/session";
import { handleKnownError as _ } from "~/domain/utilities/error-handling";
import { LOGIN_ERROR_KEYS as ERROR_KEYS } from "./config";

/**
 * @param {{
 *  usernameOrEmail: string,
 *  password: string,
 * }} param0
 * @returns {Promise<{
 *  token: string,
 * }>}
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

      var token = createSessionToken();

      await sessionsRepo.create({
        user_id: user.id,
        token,
      });

      return {
        token,
      };
    },
    "domain/login",
  );
}
