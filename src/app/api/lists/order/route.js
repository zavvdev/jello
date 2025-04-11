import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { reorderListsController } from "~/core/gateway/controllers/lists/reorder-lists.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PUT(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(reorderListsController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(body.board_id),
        lists_order: body.lists_order,
      });
    },
  );
}
