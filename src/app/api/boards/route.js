import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { getBoardsController } from "~/core/gateway/controllers/boards/get-boards.controller";
import { withQueryParams, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession, withQueryParams)(
    async (session_token, searchParams) => {
      var $task = Task.of(getBoardsController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        role: searchParams.get("role"),
        archived: ["true", "on"].includes(
          searchParams.get("archived"),
        ),
        search: searchParams.get("search"),
        sort_by: searchParams.get("sort_by"),
        sort_order: searchParams.get("sort_order"),
      });
    },
  );
}
