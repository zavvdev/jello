import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { taskCommentsRepo } from "~/core/infrastructure/repositories/task-comments.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";
import { Result } from "~/core/domain/result";

/**
 * @param {{
 *  user_id: number;
 *  task_id: number;
 * }} dto
 */
export async function getTaskCommentsProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.getBoard.bind(tasksRepo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.chain(taskCommentsRepo.getAll.bind(taskCommentsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
