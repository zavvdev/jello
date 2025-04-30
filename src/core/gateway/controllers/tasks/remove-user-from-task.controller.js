import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { removeUserFromTaskProcess } from "~/core/domain/processes/tasks/remove-user-from-task.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
      user_id: Id,
    }),
  ),
};

export async function removeUserFromTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await removeUserFromTaskProcess({
        user_id: user.id,
        task_id: request.task_id,
        remove_user_id: request.user_id,
      });
    }),
  );
}
