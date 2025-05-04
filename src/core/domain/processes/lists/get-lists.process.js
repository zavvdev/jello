import { Either as E, head, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { listsRepo } from "~/core/infrastructure/repositories/lists.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  filter_user_id?: number;
 *  filter_label_id?: number;
 *  search?: string;
 * }} dto
 */
export async function getListsProcess(dto) {
  var prepareDto = ({
    board_id,
    filter_user_id,
    filter_label_id,
    search,
  }) =>
    E.right({
      board_id,
      user_id: filter_user_id,
      label_id: filter_label_id,
      search,
    });

  var $task = Task.all(Task.of(E.asyncRight), $checkBoardExistance())
    .map(E.all(head))
    .map(E.chain(prepareDto))
    .map(E.chain(listsRepo.getAll.bind(listsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
