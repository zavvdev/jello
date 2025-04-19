import { Either as E, head, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { labelsRepo } from "~/core/infrastructure/repositories/labels.repository";
import { $checkBoardExistance } from "~/core/domain/utilities";

/**
 * @param {{
 *  user_id: number;
 *  board_id: number;
 * }} dto
 */
export async function getLabelsProcess(dto) {
  var $task = Task.all(Task.of(E.asyncRight), $checkBoardExistance())
    .map(E.all(head))
    .map(E.chain(labelsRepo.getAll.bind(labelsRepo)))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
