import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { User } from "~/core/entity/models/user";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { updateUserProcess } from "~/core/domain/processes/users/update-user.process";

var dtoSchema = {
  request: authSchema.concat(
    User.schema.pick([
      "first_name",
      "last_name",
      "username",
      "email",
      "bio",
    ]),
  ),
};

export async function updateUserController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await updateUserProcess({
        user_id: user.id,
        first_name: request.first_name,
        last_name: request.last_name,
        username: request.username,
        email: request.email,
        bio: request.bio,
      });
    }),
  );
}
