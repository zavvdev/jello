import {
  compose,
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

    var assignOwner = Task.all(
      Task.of(E.asyncRight),
      Task.of(({ user_id, board_id }) =>
        boardsRepo.assignUser({
          user_id,
          board_id,
          role: UserRole.Owner,
        }),
      ),
    )
      .map(E.all(head))
      .join();

    var assignUsers = async (mergedData) => {
      var { assigned_users } = mergedData;

      if (assigned_users.length === 0) {
        return E.right(mergedData);
      }

      var $assignUsersTasks = assigned_users.map(({ id, role }) =>
        Task.of(({ board_id }) =>
          boardsRepo.assignUser({ user_id: id, board_id, role }),
        ),
      );

      return await Task.all(
        Task.of(E.asyncRight),
        ...$assignUsersTasks,
      )
        .map(E.all(head))
        .run(mergedData);
    };

    var createLabels = async (mergedData) => {
      var { labels } = mergedData;

      if (labels.length === 0) {
        return E.right(mergedData);
      }

      var $createLabelsTasks = labels.map(({ name, color }) =>
        Task.of(({ board_id }) =>
          labelsRepo.create({ name, color, board_id }),
        ),
      );

      return Task.all(Task.of(E.asyncRight), ...$createLabelsTasks)
        .map(E.all(head))
        .run(mergedData);
    };

    var $task = Task.all(
      Task.of(E.asyncRight),
      Task.of(boardsRepo.create.bind(boardsRepo)),
    )
      .map(E.joinAll(compose(E.right, mergeObjects)))
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
