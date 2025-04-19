import { Either as E, head, Task } from "jello-fp";
import { User } from "~/core/entity/models/user";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  id: number;
 *  name?: string;
 *  order_index?: number;
 * }} dto
 */
export async function updateListProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkAuthority(User.canEditList),
  )
    .map(E.all(head))
    .map(E.chain(listsRepo.update.bind(listsRepo)))
    .join();

  return await $task(dto);
}
