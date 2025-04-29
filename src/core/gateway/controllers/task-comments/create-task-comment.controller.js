import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
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
import { createTaskCommentProcess } from "~/core/domain/processes/task-comments/create-task-comment.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
      body: t.string(T.typeString).required(T.required),
    }),
  ),
  response: Result.schema(
    t.object({
      id: Id,
    }),
  ),
};

export async function createTaskCommentController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(createTaskCommentProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        task_id: request.task_id,
        body: request.body,
      });
    }),
  );
}
