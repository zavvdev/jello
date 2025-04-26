import {
  compose,
  Either as E,
  mergeObjects,
  prop,
  Task,
  toObject,
} from "jello-fp";
import { User } from "~/core/entity/models/user";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";

/**
 * @param {{
 *  user_id: number;
 *  id: number;
 * }} dto
 */
export async function deleteListProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(listsRepo.getOne.bind(listsRepo))
      .map(E.map(prop("board_id")))
      .map(E.map(toObject("board_id"))),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.passAsync($checkAuthority(User.canDeleteList).join()))
    .map(E.chain(listsRepo.delete.bind(listsRepo)))
    .join();

  return await $task(dto);
}
