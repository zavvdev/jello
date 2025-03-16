import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { sessionsRepo } from "~/core/infrastructure/repositories/sessions.repositiry";
import { Result } from "~/core/domain/result";

/**
 * @param {{
 *  token: string;
 * }} dto
 */
export async function logoutProcess(dto) {
  try {
    await sessionsRepo.destroy({ token: dto.token });
    return E.right();
  } catch (e) {
    if (e.message === "session_not_found") {
      return E.left(Result.of({ message: MESSAGES.notFound }));
    }
    return E.left();
  }
}
