import "server-only";

import { Either as E, Task } from "jello-fp";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";
import { Result } from "~/core/domain/result";
import { sessionsRepo } from "~/core/infrastructure/repositories/sessions.repository";

/**
 * @param {{
 *  usernameOrEmail: string;
 *  password: string;
 * }} dto
 */
export async function loginProcess(dto) {
  var $task = Task.of(usersRepo.getByCredentials.bind(usersRepo))
    .map(E.chain(sessionsRepo.create.bind(sessionsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
