import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { getTaskLabelsController } from "~/core/gateway/controllers/tasks/get-task-labels.controller";
import { assignLabelToTaskController } from "~/core/gateway/controllers/tasks/assign-label-to-task.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getTaskLabelsController)
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

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(assignLabelToTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        task_id: parseInt(id),
        label_id: body.label_id,
      });
    },
  );
}
