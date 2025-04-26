import { Either as E, Task } from "jello-fp";
import { User } from "~/core/entity/models/user";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  id: number;
 *  name?: string;
 *  order_index?: number;
 * }} dto
 */
export async function updateListProcess(dto) {
  var merge = ([dto, { board_id }]) => E.right({ ...dto, board_id });

  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(listsRepo.getOne.bind(listsRepo)),
  )
    .map(E.joinAll(merge))
    .map(E.forwardAsync($checkBoardExistance().join()))
    .map(E.forwardAsync($checkAuthority(User.canEditList).join()))
    .map(E.chain(listsRepo.update.bind(listsRepo)))
    .join();

  return await $task(dto);
}
