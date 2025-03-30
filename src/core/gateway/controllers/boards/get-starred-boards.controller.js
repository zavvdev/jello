import "server-only";

import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { Board } from "~/core/entity/models/board";
import { getStarredBoardsProcess } from "~/core/domain/processes/boards/get-starred-boards.process";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { try_ } from "~/core/gateway/utilities";

var dtoSchema = {
  response: Result.schema(
    t.array().of(Board.schema).required(),
  ).required(),
};

export async function getStarredBoardsController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withResponseValidator(dtoSchema.response),
    )(async (user, validateResponse) => {
      var $task = Task.of(getStarredBoardsProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
      });
    }),
  );
}
