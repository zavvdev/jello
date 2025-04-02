import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { searchUsersController } from "~/core/gateway/controllers/users/search-users.controller";
import { withQueryParams, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession, withQueryParams)(
    async (session_token, searchParams) => {
      var $task = Task.of(searchUsersController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        username: searchParams.get("username"),
      });
    },
  );
}
