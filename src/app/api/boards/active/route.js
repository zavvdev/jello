import { Task } from "jello-fp";
import { getActiveBoardsController } from "~/core/gateway/controllers/boards/get-active-boards.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return withSession(request, async (session_token) => {
    var getBoards = () => getActiveBoardsController({ session_token });
    var $task = Task.of(getBoards).map(forward_(200)).map(catch_()).join();
    return await $task();
  });
}
