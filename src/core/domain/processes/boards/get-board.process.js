import { Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getBoardProcess(dto) {
  var $task = Task.of(boardsRepo.getOne.bind(boardsRepo))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
