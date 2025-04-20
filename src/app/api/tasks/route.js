import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { createTaskController } from "~/core/gateway/controllers/tasks/create-task.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(createTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: body.board_id,
        list_id: body.list_id,
        name: body.name,
        description: body.description,
        assigned_users: body.assigned_users,
        assigned_labels: body.assigned_labels,
      });
    },
  );
}
