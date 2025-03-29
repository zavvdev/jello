import { Either as E, prop, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
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
  var terminate = () =>
    E.left(
      Result.of({
        message: MESSAGES.invalidCredentials,
      }),
    );

  var $task = Task.of(usersRepo.getByCredentials.bind(usersRepo))
    .map(E.map(prop("id")))
    .map(E.map((id) => ({ user_id: id })))
    .map(E.chain(sessionsRepo.create.bind(sessionsRepo)))
    .map(E.map((x) => ({ token: x })))
    .map(Result.fromEither)
    .map(E.chainLeft(terminate))
    .join();

  return await $task(dto);
}
