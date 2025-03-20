import { Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

export var sortableFields = ["date", "name"];

/**
 * @param {{
 *  user_id: number;
 *  role: string;
 *  is_archived: boolean;
 *  search: string;
 *  sort_by: "date" | "name";
 *  sort_order: "asc" | "desc";
 * }} dto
 */
export async function getBoardsProcess(dto) {
  var $task = Task.of(boardsRepo.getAll.bind(boardsRepo))
    .map(Result.fromEither)
    .join();

  return await $task(dto);
}
