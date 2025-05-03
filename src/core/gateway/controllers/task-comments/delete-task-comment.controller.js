import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { deleteTaskCommentProcess } from "~/core/domain/processes/task-comments/delete-task-comment.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      id: Id,
    }),
  ),
};

export async function deleteTaskCommentController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await deleteTaskCommentProcess({
        user_id: user.id,
        id: request.id,
      });
    }),
  );
}
