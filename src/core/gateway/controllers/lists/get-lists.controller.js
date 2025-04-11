import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { List } from "~/core/entity/models/list";
import { Task as TaskModel } from "~/core/entity/models/task";
import { Id } from "~/core/entity/types";
import { getListsProcess } from "~/core/domain/processes/lists/get-lists.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      board_id: Id,
    }),
  ),
  response: Result.schema(
    t
      .array()
      .of(
        List.schema.concat(
          t.object({
            tasks: t.array().of(TaskModel.schema).required(),
          }),
        ),
      )
      .required(),
  ).required(),
};

export async function getListsController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getListsProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
