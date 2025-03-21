import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { loginController } from "~/core/gateway/controllers/auth/login.controller";
import { catch_, forward_ } from "~/app/api/utilities";
import { withRequestBody } from "~/app/api/middleware";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withRequestBody)(async (body) => {
    var $task = Task.of(loginController)
      .map(forward_())
      .map(catch_())
      .join();

    return await $task({
      usernameOrEmail: body.usernameOrEmail,
      password: body.password,
    });
  });
}
