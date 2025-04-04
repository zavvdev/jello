import { cond, Either as E, head, not, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function starBoardProcess(dto) {
  var noBoard = () =>
    E.left(
      Result.of({
        message: MESSAGES.boardNotFound,
      }),
    );

  var alreadyStarred = () =>
    E.left(
      Result.of({
        message: MESSAGES.alreadyStarred,
      }),
    );

  var $checkExistance = Task.of(
    boardsRepo.userHasBoard.bind(boardsRepo),
  ).map(E.chain(cond(noBoard, [Boolean, E.right])));

  var $checkIfAlreadyStarred = Task.of(
    boardsRepo.getStarredBoardsCount.bind(boardsRepo),
  ).map(E.chain(cond(alreadyStarred, [not, E.right])));

  var $task = Task.run(
    Task.of(E.asyncRight),
    $checkExistance,
    $checkIfAlreadyStarred,
  )
    .map(E.mapAll(head))
    .map(E.chain(boardsRepo.starBoard.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
