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
import { Board } from "~/core/entity/models/board";
import { User, UserRole } from "~/core/entity/models/user";
import { Label } from "~/core/entity/models/label";
import { Result } from "~/core/domain/result";
import { createBoardProcess } from "~/core/domain/processes/boards/create-board.process";

var assignedUserSchema = User.schema
  .pick(["id"])
  .concat(t.object({ role: UserRole.schema.required(T.required) }));

var labelSchema = Label.schema.pick(["name", "color"]);

var dtoSchema = {
  request: authSchema.concat(
    Board.schema.pick(["name", "description", "color"]).concat(
      t.object({
        assigned_users: t
          .array()
          .of(assignedUserSchema)
          .nullable()
          .typeError(T.typeArray),
        labels: t
          .array()
          .of(labelSchema)
          .nullable()
          .typeError(T.typeArray),
      }),
    ),
  ),
  response: Result.schema(
    t.object({
      board_id: t.number().required(),
    }),
  ),
};

export async function createBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(createBoardProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        name: request.name,
        color: request.color,
        description: request.description || null,
        assigned_users: request.assigned_users || [],
        labels: request.labels || [],
      });
    }),
  );
}
