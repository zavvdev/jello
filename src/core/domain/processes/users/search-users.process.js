import { Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 *  username: string;
 * }} dto
 */
export async function searchUsersProcess(dto) {
  var $task = Task.of(usersRepo.searchByUsername.bind(usersRepo))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
