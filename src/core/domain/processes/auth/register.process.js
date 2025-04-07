import { Task } from "jello-fp";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  username: string;
 *  email: string;
 *  first_name: string;
 *  last_name: string;
 *  password: string;
 * }} dto
 */
export async function registerProcess(dto) {
  var $task = Task.of(usersRepo.create.bind(usersRepo)).join();
  return await $task(dto);
}
