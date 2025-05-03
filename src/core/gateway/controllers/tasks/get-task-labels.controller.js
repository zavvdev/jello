import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { Result } from "~/core/domain/result";
import { Label } from "~/core/entity/models/label";
import { getTaskLabelsProcess } from "~/core/domain/processes/tasks/get-task-labels.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
    }),
  ),
  response: Result.schema(
    t.array().of(Label.schema.pick(["id", "name", "color"])),
  ),
};

export async function getTaskLabelsController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getTaskLabelsProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        task_id: request.task_id,
      });
    }),
  );
}
