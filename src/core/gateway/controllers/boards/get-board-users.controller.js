import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { User, UserRole } from "~/core/entity/models/user";
import { getBoardUsersProcess } from "~/core/domain/processes/boards/get-board-users.process";

var UserSchema = User.schema
  .pick(["id", "username", "first_name", "last_name"])
  .concat(
    t.object({
      role: UserRole.schema.required(T.required),
    }),
  );

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      board_id: Id,
    }),
  ),
  response: Result.schema(
    t.array().of(UserSchema).required(),
  ).required(),
};

export async function getBoardUsersController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(getBoardUsersProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
