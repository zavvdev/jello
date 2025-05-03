import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { taskCommentsRepo } from "~/core/infrastructure/repositories/task-comments.repository";
import {
  $checkBoardExistance,
  $checkTaskCommentOwnership,
} from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  id: number;
 *  body: string;
 * }} dto
 */
export async function updateTaskCommentProcess(dto) {
  var checkBoard = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.getBoard.bind(tasksRepo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .join();

  var $task = Task.all(
    Task.of(E.asyncRight),
    $checkTaskCommentOwnership(),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync(checkBoard))
    .map(E.chain(taskCommentsRepo.update.bind(taskCommentsRepo)))
    .join();

  return await $task(dto);
}
