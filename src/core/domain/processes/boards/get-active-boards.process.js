import { Either as E } from "jello-fp";
import { RESULT } from "~/core/domain/result";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";

/**
 * @param {{
 *  user_id: number;
 * }} dto
 */
export async function getActiveBoardsProcess(dto) {
  try {
    var boards = await boardsRepo.getActive({
      user_id: dto.user_id,
    });

    return E.right(
      RESULT({
        data: boards,
      }),
    );
  } catch {
    return E.left();
  }
}
