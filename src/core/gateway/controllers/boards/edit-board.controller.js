import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Board } from "~/core/entity/models/board";
import { User, UserRole } from "~/core/entity/models/user";
import { Label } from "~/core/entity/models/label";
import { editBoardProcess } from "~/core/domain/processes/boards/edit-board.process";
import { Id } from "~/core/entity/types";

var assignedUserSchema = User.schema
  .pick(["id"])
  .concat(t.object({ role: UserRole.schema.required(T.required) }));

var labelSchema = Label.schema.pick(["name", "color"]).concat(
  t.object({
    id: t.number().nullable().typeError(T.typeNumber),
  }),
);

var dtoSchema = {
  request: authSchema.concat(
    Board.schema.pick(["name", "description", "color"]).concat(
      t.object({
        board_id: Id,
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
};

export async function editBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await editBoardProcess({
        user_id: user.id,
        board_id: request.board_id,
        name: request.name,
        color: request.color,
        description: request.description || null,
        assigned_users: request.assigned_users || [],
        labels: request.labels || [],
      });
    }),
  );
}
