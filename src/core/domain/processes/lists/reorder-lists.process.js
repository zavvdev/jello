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
 *  lists_order: number[];
 * }} dto
 */
export async function reorderListsProcess(dto) {
  var reorder = ({ lists_order }) =>
    Task.all(
      ...lists_order.map((list_id, index) =>
        Task.of(() =>
          listsRepo.update({ id: list_id, order_index: index }),
        ),
      ),
    )
      .map(E.all(head))
      .run();

  var $checkListsExistance = Task.of(({ board_id, lists_order }) =>
    listsRepo.belongToBoard({ board_id, ids: lists_order }),
  );

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $checkAuthority(User.canEditList),
    $checkListsExistance,
  )
    .map(E.all(head))
    .map(E.chain(reorder))
    .join();

  return await $task(dto);
}
