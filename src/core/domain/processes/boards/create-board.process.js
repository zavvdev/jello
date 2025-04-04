import {
  Either as E,
  head,
  mergeObjects,
  prop,
  Task,
} from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { UserRole } from "~/core/entity/models/user";
import { BoardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { LabelsRepo } from "~/core/infrastructure/repositories/labels.repository";
import { Result } from "~/core/domain/result";

/**
 * @param {{
 *  user_id: number;
 *  name: string;
 *  description: string | null;
 *  color: string;
 *  assigned_users: Array<{ id: number; role: string; }>;
 *  labels: Array<{ name: string; color: string; }>;
 * }} dto
 */
export async function createBoardProcess(dto) {
  return db.transaction(async (client) => {
    var boardsRepo = new BoardsRepo(client);
    var labelsRepo = new LabelsRepo(client);

    var assignOwner = async (mergedData) => {
      var { user_id, board_id } = mergedData;

      var $assignOwner = Task.run(
        Task.of(E.asyncRight),
        Task.of(() =>
          boardsRepo.assignUser({
            user_id,
            board_id,
            role: UserRole.Owner,
          }),
        ),
      )
        .map(E.mapAll(head))
        .join();

      return await $assignOwner(mergedData);
    };

    var assignUsers = async (mergedData) => {
      var { board_id, assigned_users } = mergedData;

      if (assigned_users.length === 0) {
        return E.right(mergedData);
      }

      var $assignUsersTasks = assigned_users.map(({ id, role }) =>
        Task.of(() =>
          boardsRepo.assignUser({ user_id: id, board_id, role }),
        ),
      );

      var $assign = Task.run(
        Task.of(E.asyncRight),
        ...$assignUsersTasks,
      )
        .map(E.mapAll(head))
        .join();

      return await $assign(mergedData);
    };

    var createLabels = async (mergedData) => {
      var { board_id, labels } = mergedData;

      if (labels.length === 0) {
        return E.right(mergedData);
      }

      var $createLabelsTasks = labels.map(({ name, color }) =>
        Task.of(() => labelsRepo.create({ name, color, board_id })),
      );

      var $create = Task.run(
        Task.of(E.asyncRight),
        ...$createLabelsTasks,
      )
        .map(E.mapAll(head))
        .join();

      return await $create(mergedData);
    };

    var $task = Task.run(
      Task.of(E.asyncRight),
      Task.of(boardsRepo.create.bind(boardsRepo)),
    )
      .map(E.mapAll(mergeObjects))
      .map(E.chain(assignOwner))
      .map(E.chain(assignUsers))
      .map(E.chain(createLabels))
      .map(E.map(prop("board_id")))
      .map(E.map((x) => ({ board_id: x })))
      .map(Result.fromEither)
      .join();

    return await $task({
      ...dto,
      is_archived: false,
    });
  });
}
