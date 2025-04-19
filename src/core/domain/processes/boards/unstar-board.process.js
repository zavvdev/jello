import { cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function unstarBoardProcess(dto) {
  var alreadyUnstarred = () =>
    E.left(
      Result.of({
        message: MESSAGES.alreadNotStarred,
      }),
    );

  var $checkIfAlreadyUnstarred = Task.of(
    boardsRepo.getStarredBoardsCount.bind(boardsRepo),
  ).map(E.chain(cond(alreadyUnstarred, [Boolean, E.right])));

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkIfAlreadyUnstarred,
  )
    .map(E.all(head))
    .map(E.chain(boardsRepo.unstarBoard.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
