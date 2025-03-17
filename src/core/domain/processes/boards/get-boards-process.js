import { Either as E } from "jello-fp";
import { Result } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

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
  try {
    var boards = await boardsRepo.getAll({
      user_id: dto.user_id,
      role: dto.role,
      is_archived: dto.is_archived,
      search: dto.search,
      sort_by: dto.sort_by,
      sort_order: dto.sort_order,
    });

    return E.right(
      Result.of({
        data: boards,
      }),
    );
  } catch {
    return E.left();
  }
}
