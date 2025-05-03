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
import { Task as TaskModel } from "~/core/entity/models/task";
import { Id } from "~/core/entity/types";
import { Result } from "~/core/domain/result";
import { getTaskProcess } from "~/core/domain/processes/tasks/get-task.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
    }),
  ),
  response: Result.schema(TaskModel.schema.required()),
};

export async function getTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getTaskProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        task_id: request.task_id,
      });
    }),
  );
}
