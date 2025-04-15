import { Either as E, head, Task } from "jello-fp";
import { User } from "~/core/entity/models/user";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  id: number;
 * }} dto
 */
export async function deleteListProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkAuthority(User.canDeleteList),
  )
    .map(E.all(head))
    .map(E.chain(listsRepo.delete.bind(listsRepo)))
    .join();

  return await $task(dto);
}
