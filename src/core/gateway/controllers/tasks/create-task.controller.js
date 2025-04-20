import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Task as TaskModel } from "~/core/entity/models/task";
import { User } from "~/core/entity/models/user";
import { Label } from "~/core/entity/models/label";
import { Result } from "~/core/domain/result";
import { Id } from "~/core/entity/types";
import { createTaskProcess } from "~/core/domain/processes/tasks/create-task.process";

var assignedUserSchema = User.schema.pick("id");
var assignedLabelSchema = Label.schema.pick("id");

var dtoSchema = {
  request: authSchema.concat(
    TaskModel.schema.pick(["name", "description"]).concat(
      t.object({
        board_id: Id,
        list_id: Id,
        assigned_users: t
          .array()
          .of(assignedUserSchema)
          .nullable()
          .typeError(T.typeArray),
        assigned_labels: t
          .array()
          .of(assignedLabelSchema)
          .nullable()
          .typeError(T.typeArray),
      }),
    ),
  ),
  response: Result.schema(
    t.object({
      task_id: t.number().required(),
    }),
  ),
};

export async function createTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(createTaskProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        board_id: request.board_id,
        list_id: request.list_id,
        name: request.name,
        description: request.description || null,
        assigned_users: request.assigned_users || [],
        assigned_labels: request.assigned_labels || [],
      });
    }),
  );
}
