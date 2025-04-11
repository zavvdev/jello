import { Either as E, head, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getBoardUsersProcess(dto) {
  var $task = Task.all(Task.of(E.asyncRight), $checkBoardExistance())
    .map(E.all(head))
    .map(E.chain(boardsRepo.getAssignedUsers.bind(boardsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
