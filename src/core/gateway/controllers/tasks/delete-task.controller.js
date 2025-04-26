import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { deleteTaskProcess } from "~/core/domain/processes/tasks/delete-task.process";

var dtoSchema = {
  request: authSchema.concat(
    t
      .object({
        board_id: Id,
        task_id: Id,
      })
      .required(),
  ),
};

export async function deleteTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await deleteTaskProcess({
        user_id: user.id,
        board_id: request.board_id,
        task_id: request.task_id,
      });
    }),
  );
}
