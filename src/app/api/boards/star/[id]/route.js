import { Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { unstarBoardController } from "~/core/gateway/controllers/boards/unstar-board.controller";
import { withSession } from "~/app/api/middleware";
import { catch_, forward_ } from "~/app/api/utilities";

export async function DELETE(request, { params }) {
  var { id } = await params;

  return applyMiddlewares(request)(withSession)(
    async (session_token) => {
      var $task = Task.of(unstarBoardController)
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
