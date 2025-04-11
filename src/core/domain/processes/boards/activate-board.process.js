import { Either as E, head, Task } from "jello-fp";
import { User } from "~/core/entity/models/user";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function activateBoardProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkAuthority(User.canArchiveBoard),
  )
    .map(E.all(head))
    .map(E.chain(boardsRepo.activate.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
