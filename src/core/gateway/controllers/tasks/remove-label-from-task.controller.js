import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { removeLabelFromTaskProcess } from "~/core/domain/processes/tasks/remove-label-from-task.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      task_id: Id,
      label_id: Id,
    }),
  ),
};

export async function removeLabelFromTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await removeLabelFromTaskProcess({
        user_id: user.id,
        task_id: request.task_id,
        label_id: request.label_id,
      });
    }),
  );
}
