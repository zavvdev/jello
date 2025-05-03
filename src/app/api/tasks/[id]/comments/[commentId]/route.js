import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { updateTaskCommentController } from "~/core/gateway/controllers/task-comments/update-task-comment.controller";
import { deleteTaskCommentController } from "~/core/gateway/controllers/task-comments/delete-task-comment.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PUT(request, { params }) {
  var { commentId } = await params;

  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(updateTaskCommentController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        id: parseInt(commentId),
        body: body.body,
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { commentId } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteTaskCommentController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        id: parseInt(commentId),
      });
    },
  );
}
