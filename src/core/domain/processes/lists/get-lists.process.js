import { cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getListsProcess(dto) {
  var noBoard = () =>
    E.left(
      Result.of({
        message: MESSAGES.boardNotFound,
      }),
    );

  var $checkExistance = Task.of(
    boardsRepo.userHasBoard.bind(boardsRepo),
  ).map(E.chain(cond(noBoard, [Boolean, E.right])));

  var $task = Task.all(Task.of(E.asyncRight), $checkExistance)
    .map(E.all(head))
    .map(E.chain(listsRepo.getAll.bind(listsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
