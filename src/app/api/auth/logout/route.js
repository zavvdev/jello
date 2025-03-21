import { Task } from "jello-fp";
import { logoutController } from "~/core/gateway/controllers/auth/logout.controller";
import { catch_, forward_ } from "~/app/api/utilities";
import { applyMiddlewares, withRequestBody } from "../../middleware";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withRequestBody)(async (body) => {
    var $task = Task.of(logoutController)
      .map(forward_())
      .map(catch_())
      .join();

    return await $task({
      token: body.token,
    });
  });
}
