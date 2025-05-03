import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { updateTaskCommentProcess } from "~/core/domain/processes/task-comments/update-task-comment.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      id: Id,
      body: t.string(T.typeString).required(T.required),
    }),
  ),
};

export async function updateTaskCommentController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await updateTaskCommentProcess({
        user_id: user.id,
        id: request.id,
        body: request.body,
      });
    }),
  );
}
