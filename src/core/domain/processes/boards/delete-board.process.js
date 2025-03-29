import { compose, cond, Either as E, head, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { User } from "~/core/entity/models/user";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function deleteBoardProcess(dto) {
  var unauthorized = () =>
    E.left(Result.of({ message: MESSAGES.unauthorizedAction }));

  var transformDto = (dto) => ({
    board_id: dto.board_id,
  });

  var $checkAuthority = Task.of(
    boardsRepo.getUserRole.bind(boardsRepo),
  ).map(E.chain(cond(unauthorized, [User.canDeleteBoard, E.right])));

  var $task = Task.run(Task.of(E.asyncRight), $checkAuthority)
    .map(E.chainAll(compose(E.right, head)))
    .map(E.map(transformDto))
    .map(E.chain(boardsRepo.destroy.bind(boardsRepo)))
    .join();

  return await $task(dto);
}
