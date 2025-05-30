import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { getBoardUsersController } from "~/core/gateway/controllers/boards/get-board-users.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getBoardUsersController)
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
