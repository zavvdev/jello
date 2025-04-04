import { cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getBoardUsersProcess(dto) {
  var noBoard = () =>
    E.left(
      Result.of({
        message: MESSAGES.boardNotFound,
      }),
    );

  var $checkExistance = Task.of(
    boardsRepo.userHasBoard.bind(boardsRepo),
  ).map(E.chain(cond(noBoard, [Boolean, E.right])));

  var $task = Task.run(Task.of(E.asyncRight), $checkExistance)
    .map(E.mapAll(head))
    .map(E.chain(boardsRepo.getAssignedUsers.bind(boardsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
