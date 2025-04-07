import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { getUserController } from "~/core/gateway/controllers/users/get-user.controller";
import { deleteUserController } from "~/core/gateway/controllers/users/delete-user.controller";
import { updateUserController } from "~/core/gateway/controllers/users/update-user.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
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

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PUT(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(updateUserController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        email: body.email,
        bio: body.bio,
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request) {
  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteUserController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
      });
    },
  );
}
