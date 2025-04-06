import { Either as E, head, Task } from "jello-fp";
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
  var $checkUsername = Task.of(
    usersRepo.isUsernameAvailable.bind(usersRepo),
  );

  var $checkEmail = Task.of(
    usersRepo.isEmailAvailable.bind(usersRepo),
  );

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkUsername,
    $checkEmail,
  )
    .map(E.all(head))
    .map(E.chain(usersRepo.create.bind(usersRepo)))
    .join();

  return await $task(dto);
}
