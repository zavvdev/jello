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
import { User } from "~/core/entity/models/user";
import { getTaskUsersProcess } from "~/core/domain/processes/tasks/get-task-users.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
    }),
  ),
  response: Result.schema(
    t
      .array()
      .of(
        User.schema.pick([
          "id",
          "username",
          "first_name",
          "last_name",
        ]),
      ),
  ),
};

export async function getTaskUsersController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getTaskUsersProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        task_id: request.task_id,
      });
    }),
  );
}
