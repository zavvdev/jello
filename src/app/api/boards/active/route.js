import { boardsRepo } from "~/infra/repositories/boards";
import { withAuth } from "~/app/api/middleware";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "~/app/api/config";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return withAuth(request, async (user) => {
    try {
      var boards = await boardsRepo.getActive({
        userId: user.id,
      });

      return SUCCESS_RESPONSE({
        data: boards,
      });
    } catch {
      return ERROR_RESPONSE();
    }
  });
}
