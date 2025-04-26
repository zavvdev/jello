import {
  compose,
  Either as E,
  head,
  mergeObjects,
  prop,
  Task,
  toObject,
} from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { Result } from "~/core/domain/result";
import { TasksRepo } from "~/core/infrastructure/repositories/tasks.repository";
import { BoardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";
import { LabelsRepo } from "~/core/infrastructure/repositories/labels.repository";
import { ListsRepo } from "~/core/infrastructure/repositories/lists.repository";

/**
 * @param {{
 *  user_id: number;
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
    var boardsRepo = new BoardsRepo(client);
    var labelsRepo = new LabelsRepo(client);
    var listsRepo = new ListsRepo(client);

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

    var createTask = (dto) => {
      return Task.of(tasksRepo.create.bind(tasksRepo))
        .map(
          E.map((task) => ({
            ...dto,
            task_id: task.task_id,
          })),
        )
        .run(dto);
    };

    var checkBoardLabels = () => {
      var check = ([{ assigned_labels }, board_labels]) =>
        assigned_labels.length === 0 ||
        assigned_labels.every((l) =>
          board_labels.find((bl) => bl.id === l.id),
        )
          ? E.right()
          : E.left(
              Result.of({
                message: MESSAGES.labelNotInBoard,
              }),
            );

      return Task.all(
        Task.of(E.asyncRight),
        Task.of(labelsRepo.getAll.bind(labelsRepo)),
      )
        .map(E.joinAll(check))
        .join();
    };

    var checkBoardUsers = () => {
      var check = ([{ assigned_users }, board_users]) =>
        assigned_users.length === 0 ||
        assigned_users.every((u) =>
          board_users.find((bu) => bu.id === u.id),
        )
          ? E.right()
          : E.left(
              Result.of({
                message: MESSAGES.userNotInBoard,
              }),
            );

      return Task.all(
        Task.of(E.asyncRight),
        Task.of(boardsRepo.getAssignedUsers.bind(boardsRepo)),
      )
        .map(E.joinAll(check))
        .join();
    };

    var $getList = Task.of((dto) =>
      listsRepo.getOne({ id: dto.list_id }),
    ).map(E.map(compose(toObject("board_id"), prop("board_id"))));

    var $task = Task.all(Task.of(E.asyncRight), $getList)
      .map(E.joinAll(compose(E.right, mergeObjects)))
      .map(E.passAsync($checkBoardExistance().join()))
      .map(E.passAsync(checkBoardUsers()))
      .map(E.passAsync(checkBoardLabels()))
      .map(E.chain(createTask))
      .map(E.chain(assignUsers))
      .map(E.chain(assignLabels))
      .map(E.map(prop("task_id")))
      .map(E.map(toObject("task_id")))
      .map(Result.fromEither)
      .join();

    return await $task(dto);
  });
}
