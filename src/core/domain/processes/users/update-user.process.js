import { Task } from "jello-fp";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 *  first_name: string;
 *  last_name: string;
 *  username: string;
 *  email: string;
 *  bio: string;
 * }} dto
 */
export async function updateUserProcess(dto) {
  var $task = Task.of(usersRepo.update.bind(usersRepo)).join();
  return await $task(dto);
}
