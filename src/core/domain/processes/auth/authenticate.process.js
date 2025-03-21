import { Either as E, Task } from "jello-fp";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";
import { User } from "~/core/entity/models/user";

/**
 * @param {{
 *  session_token: string;
 * }} dto
 */
export async function authenticateProcess(dto) {
  var $task = Task.of(usersRepo.getBySessionToken.bind(usersRepo))
    .map(E.chain(User.of))
    .join();

  return await $task({
    token: dto.session_token,
  });
}
