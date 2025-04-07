import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { getUserController } from "~/core/gateway/controllers/users/get-user.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getUserController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
      });
    },
  );
}
