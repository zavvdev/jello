import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { getTaskUsersController } from "~/core/gateway/controllers/tasks/get-task-users.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getTaskUsersController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        task_id: parseInt(id),
      });
    },
  );
}
