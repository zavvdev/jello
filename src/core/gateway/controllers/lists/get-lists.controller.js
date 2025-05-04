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
import { Id } from "~/core/entity/types";
import { getListsProcess } from "~/core/domain/processes/lists/get-lists.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      board_id: Id,
      user_id: Id.nullable(),
      label_id: Id.nullable(),
      search: t.string().nullable(),
    }),
  ),
  response: Result.schema(
    t.array().of(List.schema).required(),
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
        filter_user_id: request.user_id,
        filter_label_id: request.label_id,
        search: request.search,
      });
    }),
  );
}
