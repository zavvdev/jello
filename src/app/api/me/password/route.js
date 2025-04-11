import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { updatePasswordController } from "~/core/gateway/controllers/users/update-password.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PATCH(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(updatePasswordController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        old_password: body.old_password,
        new_password: body.new_password,
      });
    },
  );
}
