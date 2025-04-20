import {
  compose,
  Either as E,
  head,
  mergeObjects,
  prop,
  Task,
} from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { Result } from "~/core/domain/result";
import { TasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { $checkBoardExistance } from "../../utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  list_id: number;
 *  name: string;
 *  description: string | null;
 *  assigned_users: Array<{ id: number; }>;
 *  assigned_labels: Array<{ id: string; }>;
 * }} dto
 */
export async function createTaskProcess(dto) {
  return db.transaction(async (client) => {
    var tasksRepo = new TasksRepo(client);

    var assignUsers = async (mergedData) => {
      var { assigned_users } = mergedData;

      if (assigned_users.length === 0) {
        return E.right(mergedData);
      }

      var $assignUsersTasks = assigned_users.map(({ id }) =>
        Task.of(({ task_id }) =>
          tasksRepo.assignUser({ user_id: id, task_id }),
        ),
      );

      return await Task.all(
        Task.of(E.asyncRight),
        ...$assignUsersTasks,
      )
        .map(E.all(head))
        .run(mergedData);
    };

    var assignLabels = async (mergedData) => {
      var { assigned_labels } = mergedData;

      if (assigned_labels.length === 0) {
        return E.right(mergedData);
      }

      var $assignLabelsTasks = assigned_labels.map(({ id }) =>
        Task.of(({ task_id }) =>
          tasksRepo.assignLabel({ label_id: id, task_id }),
        ),
      );

      return await Task.all(
        Task.of(E.asyncRight),
        ...$assignLabelsTasks,
      )
        .map(E.all(head))
        .run(mergedData);
    };

    var $task = Task.all(
      Task.of(E.asyncRight),
      $checkBoardExistance(),
      Task.of(tasksRepo.create.bind(tasksRepo)),
    )
      .map(E.joinAll(compose(E.right, mergeObjects)))
      .map(E.chain(assignUsers))
      .map(E.chain(assignLabels))
      .map(E.map(prop("task_id")))
      .map(E.map((x) => ({ task_id: x })))
      .map(Result.fromEither)
      .join();

    return await $task(dto);
  });
}
