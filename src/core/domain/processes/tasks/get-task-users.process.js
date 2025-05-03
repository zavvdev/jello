import { compose, Either as E, mergeObjects, Task } from "jello-fp";
import { tasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { $checkBoardExistance } from "../../utilities";
import { Result } from "../../result";

/**
 * @param {{
 *  user_id: number;
 *  task_id: number;
 * }} dto
 */
export async function getTaskUsersProcess(dto) {
  var $task = Task.all(
    Task.of(E.asyncRight),
    Task.of(tasksRepo.getBoard.bind(tasksRepo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.passAsync($checkBoardExistance().join()))
    .map(E.chain(tasksRepo.getUsers.bind(tasksRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
