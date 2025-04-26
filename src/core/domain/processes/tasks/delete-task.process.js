import { Either as E, head, Task } from "jello-fp";
import { User } from "~/core/entity/models/user";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  task_id: number;
 * }} dto
 */
export async function deleteTaskProcess(dto) {
  var $authorizeAction = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.get.bind(tasksRepo)),
  ).map(
    E.joinAll(([{ user_id, board_id }, { created_by }]) =>
      $checkAuthority(
        User.canDeleteTask({
          userId: user_id,
          taskCreatorId: created_by,
        }),
      ).run({
        user_id,
        board_id,
      }),
    ),
  );

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkBoardExistance(),
    $authorizeAction,
  )
    .map(E.all(head))
    .map(E.chain(tasksRepo.delete.bind(tasksRepo)))
    .join();

  return await $task(dto);
}
