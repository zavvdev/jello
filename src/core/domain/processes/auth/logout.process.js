import { Either as E, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { sessionsRepo } from "~/core/infrastructure/repositories/sessions.repositiry";
import { Result } from "~/core/domain/result";

/**
 * @param {{
 *  token: string;
 * }} dto
 */
export async function logoutProcess(dto) {
  var terminate = () =>
    E.left(Result.of({ message: MESSAGES.notFound }));

  var $task = Task.of(sessionsRepo.destroy.bind(sessionsRepo))
    .map(E.chainLeft(terminate))
    .join();

  return await $task(dto);
}
