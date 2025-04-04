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
import { Label } from "~/core/entity/models/label";
import { Id } from "~/core/entity/types";
import { getLabelsProcess } from "~/core/domain/processes/labels/get-labels.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      board_id: Id,
    }),
  ),
  response: Result.schema(
    t.array().of(Label.schema).required(),
  ).required(),
};

export async function getLabelsController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getLabelsProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
