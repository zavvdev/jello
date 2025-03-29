import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { deleteBoardController } from "~/core/gateway/controllers/boards/delete-board.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteBoardController)
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
