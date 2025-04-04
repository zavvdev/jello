import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { Board } from "~/core/entity/models/board";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { getBoardProcess } from "~/core/domain/processes/boards/get-board.process";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";

var dtoSchema = {
  request: authSchema.concat(Board.schema.pick("id").required()),
  response: Result.schema(Board.schema.nullable()).required(),
};

export async function getBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getBoardProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
