import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { usersRepo } from "~/core/infrastructure/repositories/users.repository";
import { RESULT } from "~/core/domain/result";
import { User } from "~/core/entity/models/user";

/**
 * @param {{
 *  session_token: string;
 * }} dto
 */
export async function authenticateProcess(dto) {
  try {
    var user = await usersRepo.getBySessionToken({ token: dto.session_token });
    var userModel = User.of(user);

    if (userModel.isRight) {
      return E.right(
        RESULT({
          data: userModel.join(),
        }),
      );
    } else {
      throw new Error();
    }
  } catch {
    return E.left(
      RESULT({
        message: MESSAGES.unableToAuthenticate,
      }),
    );
  }
}
