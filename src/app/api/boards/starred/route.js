import { Task } from "jello-fp";
import { getStarredBoardsController } from "~/core/gateway/controllers/boards/get-starred-boards.controller";
import { applyMiddlewares, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getStarredBoardsController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
      });
    },
  );
}
