import "server-only";

import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { User } from "~/core/entity/models/user";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { searchUsersProcess } from "~/core/domain/processes/users/search-users.process";

var dtoSchema = {
  request: authSchema.concat(User.schema.pick(["username"])),
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
      )
      .required(),
  ).required(),
};

export async function searchUsersController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (user, request, validateResponse) => {
      var $task = Task.of(searchUsersProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
        username: request.username,
      });
    }),
  );
}
