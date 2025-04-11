import { Either as E, head, Task } from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { BoardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { UsersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 * }} dto
 */
export async function deleteUserProcess(dto) {
  return db.transaction(async (client) => {
    var usersRepo = new UsersRepo(client);
    var boardsRepo = new BoardsRepo(client);

    var $deleteBoard = (board) =>
      Task.of(() => boardsRepo.delete(board));

    var deleteOwnedBoards = (merged) => {
      return Task.all(
        Task.of(E.asyncRight),
        ...merged.boards.map($deleteBoard),
      )
        .map(E.all(head))
        .run(merged);
    };

    var merge = ([{ user_id }, boards]) =>
      E.right({ user_id, boards });

    var $task = Task.all(
      Task.of(E.asyncRight),
      Task.of(boardsRepo.getOwned.bind(boardsRepo)),
    )
      .map(E.joinAll(merge))
      .map(E.chain(deleteOwnedBoards))
      .map(E.chain(usersRepo.delete.bind(usersRepo)))
      .join();

    return await $task(dto);
  });
}
