import { cond, Either as E, hasLength, head, Task } from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { BoardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { LabelsRepo } from "~/core/infrastructure/repositories/labels.repository";
import { User, UserRole } from "~/core/entity/models/user";
import {
  $checkAuthority,
  $checkBoardExistance,
} from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 *  name: string;
 *  description: string | null;
 *  color: string;
 *  assigned_users: Array<{ id: number; role: string; }>;
 *  labels: Array<{ id?: number; name: string; color: string; }>;
 * }} dto
 */
export async function editBoardProcess(dto) {
  return db.transaction(async (client) => {
    var boardsRepo = new BoardsRepo(client);
    var labelsRepo = new LabelsRepo(client);

    var updateLabels = async (data) => {
      var remove = (sorted) =>
        Task.all(
          ...sorted.removed.map(({ id }) =>
            Task.of(() => labelsRepo.delete({ id })),
          ),
        )
          .map(E.all(() => E.right(sorted)))
          .run();

      var update = (sorted) =>
        Task.all(
          ...sorted.updated.map(({ id, name, color }) =>
            Task.of(() => labelsRepo.update({ id, name, color })),
          ),
        )
          .map(E.all(() => E.right(sorted)))
          .run();

      var create = (sorted) =>
        Task.all(
          ...sorted.created.map(({ name, color }) =>
            Task.of(() =>
              labelsRepo.create({
                name,
                color,
                board_id: sorted.board_id,
              }),
            ),
          ),
        )
          .map(E.all(() => E.right(sorted)))
          .run();

      var sort = ([{ labels, board_id }, boardLabels]) =>
        E.right({
          board_id,
          removed: boardLabels.filter(
            ({ id }) => !labels.find((l) => l.id === id),
          ),
          updated: labels.filter(({ id }) =>
            boardLabels.find((l) => l.id === id),
          ),
          created: labels.filter((l) => !l.id),
        });

      var $update = Task.all(
        Task.of(E.asyncRight),
        Task.of(labelsRepo.getAll.bind(labelsRepo)),
      )
        .map(E.joinAll(sort))
        .map(E.chain(remove))
        .map(E.chain(update))
        .map(E.chain(create))
        .join();

      return await $update(data);
    };

    var updateUsers = async (data) => {
      var { board_id, assigned_users } = data;

      var toRemoveUserTask = ({ id }) =>
        Task.of(() =>
          boardsRepo.removeUser({ user_id: id, board_id }),
        );

      var removeUsers = cond(E.right, [
        hasLength,
        (users) =>
          Task.all(...users.map(toRemoveUserTask))
            .map(E.all(head))
            .run(),
      ]);

      var excludeOwner = (users) =>
        users.filter(({ role }) => role !== UserRole.Owner);

      var $removeUsersTask = Task.of(
        boardsRepo.getAssignedUsers.bind(boardsRepo),
      )
        .map(E.map(excludeOwner))
        .map(E.chain(removeUsers));

      var $assignUsersTasks = assigned_users.map(({ id, role }) =>
        Task.of(() =>
          boardsRepo.assignUser({ user_id: id, board_id, role }),
        ),
      );

      return await Task.all(
        Task.of(E.asyncRight),
        $removeUsersTask,
        ...$assignUsersTasks,
      )
        .map(E.all(head))
        .run(data);
    };

    var $editBoard = Task.of((data) =>
      boardsRepo.update({
        id: data.board_id,
        name: data.name,
        description: data.description,
        color: data.color,
      }),
    );

    var $task = Task.all(
      Task.of(E.asyncRight),
      $checkBoardExistance(boardsRepo),
      $checkAuthority(User.canEditBoard, boardsRepo),
      $editBoard,
    )
      .map(E.all(head))
      .map(E.chain(updateUsers))
      .map(E.chain(updateLabels))
      .join();

    return await $task(dto);
  });
}
