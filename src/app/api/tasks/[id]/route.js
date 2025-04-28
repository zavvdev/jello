import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { updateTaskController } from "~/core/gateway/controllers/tasks/update-task.controller";
import { deleteTaskController } from "~/core/gateway/controllers/tasks/delete-task.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
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

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PUT(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(updateTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        id: Number(id),
        name: body.name,
        description: body.description ?? null,
        list_id: body.list_id,
      });
    },
  );
}
