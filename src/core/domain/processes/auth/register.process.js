import { cond, Either as E, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
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
  var checkExistance = async (body) => {
    var emailExists = () =>
      E.left(
        Result.of({
          message: MESSAGES.emailExists,
        }),
      );

    var usernameExists = () =>
      E.left(
        Result.of({
          message: MESSAGES.usernameExists,
        }),
      );

    var matchExistance = cond(
      () => E.right(body),
      [(x) => x.byEmail, emailExists],
      [(x) => x.byUsername, usernameExists],
    );

    var $task = Task.of(usersRepo.exists.bind(usersRepo))
      .map(E.chain(matchExistance))
      .join();

    return await $task({
      username: body.username,
      email: body.email,
    });
  };

  var $task = Task.of(checkExistance)
    .map(E.chain(usersRepo.create.bind(usersRepo)))
    .join();

  return await $task(dto);
}
