import { Either as E, head, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";
import { $checkBoardExistance } from "../../utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getListsProcess(dto) {
  var $task = Task.all(Task.of(E.asyncRight), $checkBoardExistance())
    .map(E.all(head))
    .map(E.chain(listsRepo.getAll.bind(listsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
