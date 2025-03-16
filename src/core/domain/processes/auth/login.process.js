import { Either as E, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";
import { Result } from "~/core/domain/result";
import { sessionsRepo } from "~/core/infrastructure/repositories/sessions.repositiry";

/**
 * @param {{
 *  usernameOrEmail: string;
 *  password: string;
 * }} dto
 */
export async function loginProcess(dto) {
  var checkExistance = (body) => async () => {
    try {
      var user = await usersRepo.getByCredentials({
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });

      if (!user?.id) {
        return E.left(
          Result.of({
            message: MESSAGES.invalidCredentials,
          }),
        );
      }

      return E.right(user);
    } catch {
      return E.left();
    }
  };

  var createSession = async (user) => {
    try {
      var token = await sessionsRepo.create({ user_id: user.id });
      return E.right(Result.of({ data: { token } }));
    } catch {
      return E.left();
    }
  };

  var $task = Task.of(checkExistance(dto)).map(E.chain(createSession)).join();
  return await $task();
}
