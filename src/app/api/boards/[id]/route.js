import { applyMiddlewares } from "jello-utils";
import { Task } from "jello-fp";
import { deleteBoardController } from "~/core/gateway/controllers/boards/delete-board.controller";
import { editBoardController } from "~/core/gateway/controllers/boards/edit-board.controller";
import { getBoardController } from "~/core/gateway/controllers/boards/get-board.controller";
import { withRequestBody, withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(deleteBoardController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(id),
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(getBoardController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(id),
      });
    },
  );
}

/**
 * @param {import("next/server").NextRequest} request
 */
export async function PUT(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession, withRequestBody)(
    async (session_token, body) => {
      var $task = Task.of(editBoardController)
        .map(forward_())
        .map(catch_())
        .join();

      return await $task({
        session_token,
        board_id: Number(id),
        name: body.name,
        description: body.description,
        color: body.color,
        assigned_users: body.assigned_users,
        labels: body.labels,
      });
    },
  );
}
