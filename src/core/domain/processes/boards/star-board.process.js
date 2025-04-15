import { cond, Either as E, head, not, Task } from "jello-fp";
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
export async function starBoardProcess(dto) {
  var alreadyStarred = () =>
    E.left(
      Result.of({
        message: MESSAGES.alreadyStarred,
      }),
    );

  var $checkIfAlreadyStarred = Task.of(
    boardsRepo.getStarredBoardsCount.bind(boardsRepo),
  ).map(E.chain(cond(alreadyStarred, [not, E.right])));

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkIfAlreadyStarred,
  )
    .map(E.all(head))
    .map(E.chain(boardsRepo.starBoard.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
