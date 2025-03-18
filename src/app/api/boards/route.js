import { Task } from "jello-fp";
import { getBoardsController } from "~/core/gateway/controllers/boards/get-boards.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return withSession(request, async (session_token) => {
    var { searchParams } = new URL(request.url);

    var $task = Task.of(getBoardsController)
      .map(forward_(200))
      .map(catch_())
      .join();

    return await $task({
      session_token,
      role: searchParams.get("role"),
      archived: searchParams.get("archived") === "true",
      search: searchParams.get("search"),
      sort_by: searchParams.get("sort_by"),
      sort_order: searchParams.get("sort_order"),
    });
  });
}
