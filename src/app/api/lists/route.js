import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { getListsController } from "~/core/gateway/controllers/lists/get-lists.controller";
import { createListController } from "~/core/gateway/controllers/lists/create-list.controller";
import {
  withQueryParams,
  withRequestBody,
  withSession,
} from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  return applyMiddlewares(request)(withSession, withQueryParams)(
    async (session_token, queryParams) => {
      var board_id = queryParams.get("board_id");
      var user_id = queryParams.get("user_id");
      var label_id = queryParams.get("label_id");
      var search = queryParams.get("search");

      var $task = Task.of(getListsController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: parseInt(board_id),
        user_id: user_id ? parseInt(user_id) : null,
        label_id: label_id ? parseInt(label_id) : null,
        search: search || null,
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(createListController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(body.board_id),
        name: body.name,
      });
    },
  );
}
