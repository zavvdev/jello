import {
  compose,
  Either as E,
  mergeObjects,
  prop,
  Task,
  toObject,
} from "jello-fp";
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
  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(listsRepo.getOne.bind(listsRepo))
      .map(E.map(prop("board_id")))
      .map(E.map(toObject("board_id"))),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.passAsync($checkAuthority(User.canEditList).join()))
    .map(E.chain(listsRepo.update.bind(listsRepo)))
    .join();

  return await $task(dto);
}
