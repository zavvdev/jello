import { Either as E, log, Task } from "jello-fp";
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
 *  name: string;
 * }} dto
 */
export async function createListProcess(dto) {
  var updateOrderIndex = ([dto, { order_index }]) =>
    E.right({
      ...dto,
      order_index: order_index + 1,
    });

  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(listsRepo.getGreatestOrderIndex.bind(listsRepo)),
    $checkBoardExistance(),
    $checkAuthority(User.canCreateList),
  )
    .map(E.joinAll(updateOrderIndex))
    .map(log())
    .map(E.chain(listsRepo.create.bind(listsRepo)))
    .join();

  return await $task(dto);
}
