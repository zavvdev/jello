import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { starBoardController } from "~/core/gateway/controllers/boards/star-board.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(starBoardController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: body.board_id,
      });
    },
  );
}
