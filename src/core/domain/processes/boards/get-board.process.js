import { cond, Either as E, not, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getBoardProcess(dto) {
  var notFound = () =>
    E.left(
      Result.of({
        message: MESSAGES.notFound,
      }),
    );

  var $task = Task.of(boardsRepo.getOne.bind(boardsRepo))
    .map(E.chain(cond(E.right, [not, notFound])))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
