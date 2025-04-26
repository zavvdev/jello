import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { deleteTaskController } from "~/core/gateway/controllers/tasks/delete-task.controller";
import { withQueryParams, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "../../utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession, withQueryParams)(
    async (session_token, queryParams) => {
      var $task = Task.of(deleteTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        task_id: Number(id),
        board_id: Number(queryParams.get("board_id")),
      });
    },
  );
}
