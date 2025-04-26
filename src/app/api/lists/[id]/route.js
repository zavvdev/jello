import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { updateListController } from "~/core/gateway/controllers/lists/update-list.controller";
import { deleteListController } from "~/core/gateway/controllers/lists/delete-list.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PATCH(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(updateListController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        id: Number(id),
        name: body.name,
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteListController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        id: Number(id),
      });
    },
  );
}
