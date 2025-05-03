import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { taskCommentsRepo } from "~/core/infrastructure/repositories/task-comments.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";
import { Result } from "~/core/domain/result";

/**
 * @param {{
 *  user_id: number;
 *  task_id: number;
 *  body: string;
 * }} dto
 */
export async function createTaskCommentProcess(dto) {
  var prepareDto = (dto) =>
    E.right({
      task_id: dto.task_id,
      body: dto.body,
      author_id: dto.user_id,
    });

  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.getBoard.bind(tasksRepo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.chain(prepareDto))
    .map(E.chain(taskCommentsRepo.create.bind(taskCommentsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
