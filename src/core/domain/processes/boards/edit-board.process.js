import { cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { BoardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { LabelsRepo } from "~/core/infrastructure/repositories/labels.repository";
import { Result } from "~/core/domain/result";
import { User, UserRole } from "~/core/entity/models/user";

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

    var updateUsers = async (data) => {
      var { board_id, assigned_users } = data;

      var removeUsers = (users) =>
        Task.run(
          ...users.map(({ id }) =>
            Task.of(() =>
              boardsRepo.removeUser({ user_id: id, board_id }),
            ),
          ),
        )
          .map(E.mapAll(head))
          .join()();

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

      var $update = Task.run(
        Task.of(E.asyncRight),
        $removeUsersTask,
        ...$assignUsersTasks,
      )
        .map(E.mapAll(head))
        .join();

      return await $update(data);
    };

    // TODO: Check which labels are missing and delete them.
    // TODO: Those that are present, update them.
    var updateLabels = async (data) => {
      var { board_id, labels } = data;

      var $createLabelsTasks = labels.map(({ name, color }) =>
        Task.of(() => labelsRepo.create({ name, color, board_id })),
      );

      var $update = Task.run(
        Task.of(E.asyncRight),
        ...$createLabelsTasks,
      )
        .map(E.mapAll(head))
        .join();

      return await $update(data);
    };

    var editBoard = () =>
      Task.of((data) =>
        boardsRepo.update({
          id: data.board_id,
          name: data.name,
          description: data.description,
          color: data.color,
        }),
      );

    var checkAuthority = () => {
      var unauthorized = () =>
        E.left(Result.of({ message: MESSAGES.unauthorizedAction }));
      return Task.of(boardsRepo.getUserRole.bind(boardsRepo)).map(
        E.chain(cond(unauthorized, [User.canEditBoard, E.right])),
      );
    };

    var $task = Task.run(
      Task.of(E.asyncRight),
      checkAuthority(),
      editBoard(),
    )
      .map(E.mapAll(head))
      .map(E.chain(updateUsers))
      .map(E.chain(updateLabels))
      .join();

    return await $task(dto);
  });
}
