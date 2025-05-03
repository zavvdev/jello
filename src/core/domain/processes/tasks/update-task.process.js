import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { $checkBoardExistance } from "~/core/domain/utilities";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";

/**
 * @param {{
 *  user_id: number;
 *  id: number;
 *  name: string;
 *  description?: string;
 *  list_id: number;
 * }} dto
 */
export async function updateTaskProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(({ id }) => tasksRepo.getBoard({ task_id: id })),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.chain(tasksRepo.update.bind(tasksRepo)))
    .join();

  return await $task(dto);
}
