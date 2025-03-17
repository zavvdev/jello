import { Task } from "jello-fp";
import { getStarredBoardsController } from "~/core/gateway/controllers/boards/get-starred-boards.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return withSession(request, async (session_token) => {
    var getBoards = () => getStarredBoardsController({ session_token });
    var $task = Task.of(getBoards).map(forward_(200)).map(catch_()).join();
    return await $task();
  });
}
