import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { registerController } from "~/core/gateway/controllers/auth/register.controller";
import { catch_, forward_ } from "~/app/api/utilities";
import { withRequestBody } from "~/app/api/middleware";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withRequestBody)(async (body) => {
    var $task = Task.of(registerController)
      .map(forward_(201))
      .map(catch_())
      .join();

    return await $task({
      first_name: body.first_name,
      last_name: body.last_name,
      username: body.username,
      email: body.email,
      password: body.password,
      password_confirmation: body.password_confirmation,
    });
  });
}
