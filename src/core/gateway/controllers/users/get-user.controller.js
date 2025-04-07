import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { User } from "~/core/entity/models/user";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { getUserProcess } from "~/core/domain/processes/users/get-user.process";

var dtoSchema = {
  request: authSchema,
  response: Result.schema(User.schema).required(),
};

export async function getUserController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withResponseValidator(dtoSchema.response),
    )(async (user, validateResponse) => {
      var $task = Task.of(getUserProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task({
        user_id: user.id,
      });
    }),
  );
}
