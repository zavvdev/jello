import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { activateBoardController } from "~/core/gateway/controllers/boards/activate-board.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(activateBoardController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(id),
      });
    },
  );
}
