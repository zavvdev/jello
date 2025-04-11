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
 *  name: string;
 * }} dto
 */
export async function createListProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkAuthority(User.canCreateList),
  )
    .map(E.all(head))
    .map(E.chain(listsRepo.create.bind(listsRepo)))
    .join();

  return await $task(dto);
}
