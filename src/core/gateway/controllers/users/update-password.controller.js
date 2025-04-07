import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema, passwordSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { updatePasswordProcess } from "~/core/domain/processes/users/update-password.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      old_password: t.string().required(),
      new_password: passwordSchema,
    }),
  ),
};

export async function updatePasswordController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await updatePasswordProcess({
        user_id: user.id,
        username: user.username,
        old_password: request.old_password,
        new_password: request.new_password,
      });
    }),
  );
}
