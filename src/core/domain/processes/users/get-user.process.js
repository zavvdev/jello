import { Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 * }} dto
 */
export async function getUserProcess(dto) {
  var $task = Task.of(usersRepo.get.bind(usersRepo))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
