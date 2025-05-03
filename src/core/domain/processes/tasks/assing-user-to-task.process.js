import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  assign_user_id: number;
 *  task_id: number;
 * }} dto
 */
export async function assignUserToTaskProcess(dto) {
  var prepareDto = ({ task_id, assign_user_id }) =>
    E.right({
      task_id,
      user_id: assign_user_id,
    });

  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.getBoard.bind(tasksRepo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.chain(prepareDto))
    .map(E.chain(tasksRepo.assignUser.bind(tasksRepo)))
    .join();

  return await $task(dto);
}
