import { Either as E, Task } from "jello-fp";
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
  var checkExistance = (body) => async () => {
    try {
      var isExists = await usersRepo.exists({
        username: dto.username,
        email: dto.email,
      });

      if (isExists.byEmail) {
        return E.left(
          Result.of({
            message: MESSAGES.emailExists,
          }),
        );
      } else if (isExists.byUsername) {
        return E.left(
          Result.of({
            message: MESSAGES.usernameExists,
          }),
        );
      }

      return E.right(body);
    } catch {
      return E.left();
    }
  };

  var createUser = async (body) => {
    try {
      await usersRepo.create(body);
      return E.right();
    } catch {
      return E.left();
    }
  };

  var $task = Task.of(checkExistance(dto)).map(E.chain(createUser)).join();
  return await $task();
}
