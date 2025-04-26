import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { deleteTaskController } from "~/core/gateway/controllers/tasks/delete-task.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "../../utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        task_id: Number(id),
      });
    },
  );
}
