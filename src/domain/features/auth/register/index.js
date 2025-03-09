import "server-only";

import { usersRepo } from "~/infra/repos/users-repo";
import { handleKnownError as _ } from "~/domain/utilities/error-handling";
import { REGISTER_ERROR_KEYS as ERROR_KEYS } from "./config";

/**
 * @param {{
 *  username: string,
 *  firstName: string,
 *  lastName: string,
 *  email: string,
 *  password: string,
 * }} param0
 */
export async function register({
  username,
  firstName,
  lastName,
  email,
  password,
}) {
  return await _(
    ERROR_KEYS,
    async () => {
      var isExists = await usersRepo.exists({ username, email });

      if (isExists.byEmail) {
        throw new Error(ERROR_KEYS.emailExists);
      } else if (isExists.byUsername) {
        throw new Error(ERROR_KEYS.usernameExists);
      }

      await usersRepo.create({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
    },
    "domain/register",
  );
}
