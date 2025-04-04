import { compose, cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function unstarBoardProcess(dto) {
  var noBoard = () =>
    E.left(
      Result.of({
        message: MESSAGES.boardNotFound,
      }),
    );

  var alreadyUnstarred = () =>
    E.left(
      Result.of({
        message: MESSAGES.alreadNotStarred,
      }),
    );

  var $checkExistance = Task.of(
    boardsRepo.userHasBoard.bind(boardsRepo),
  ).map(E.chain(cond(noBoard, [Boolean, E.right])));

  var $checkIfAlreadyUnstarred = Task.of(
    boardsRepo.getStarredBoardsCount.bind(boardsRepo),
  ).map(E.chain(cond(alreadyUnstarred, [Boolean, E.right])));

  var $task = Task.run(
    Task.of(E.asyncRight),
    $checkExistance,
    $checkIfAlreadyUnstarred,
  )
    .map(E.chainAll(compose(E.right, head)))
    .map(E.chain(boardsRepo.unstarBoard.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
