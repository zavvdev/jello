import { Either as E, pipe } from "jello-fp";
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
  try {
    var user = await usersRepo.getBySessionToken({ token: dto.session_token });

    return pipe(
      E.map((x) =>
        Result.of({
          data: x,
        }),
      ),
      E.chainLeft(() => {
        throw new Error();
      }),
    )(User.of(user));
  } catch {
    return E.left(
      Result.of({
        message: MESSAGES.unauthorized,
      }),
    );
  }
}
