import { Either as E, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";
import { Result } from "~/core/domain/result";
import { User } from "~/core/entity/models/user";

/**
 * @param {{
 *  session_token: string;
 * }} dto
 */
export async function authenticateProcess(dto) {
  var terminate = () =>
    E.left(
      Result.of({
        message: MESSAGES.unauthorized,
      }),
    );

  var $task = Task.of(usersRepo.getBySessionToken.bind(usersRepo))
    .map(E.chain(User.of))
    .map(Result.fromEither)
    .map(E.chainLeft(terminate))
    .join();

  return await $task({
    token: dto.session_token,
  });
}
