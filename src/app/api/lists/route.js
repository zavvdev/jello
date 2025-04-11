import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { getListsController } from "~/core/gateway/controllers/lists/get-lists.controller";
import { withQueryParams, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession, withQueryParams)(
    async (session_token, queryParams) => {
      var $task = Task.of(getListsController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(queryParams.get("board_id")),
      });
    },
  );
}
