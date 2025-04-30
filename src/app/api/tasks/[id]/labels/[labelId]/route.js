import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { removeLabelFromTaskController } from "~/core/gateway/controllers/tasks/remove-label-from-task.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id: taskId, labelId } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(removeLabelFromTaskController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        task_id: parseInt(taskId),
        label_id: parseInt(labelId),
      });
    },
  );
}
