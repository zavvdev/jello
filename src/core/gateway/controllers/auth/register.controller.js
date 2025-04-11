import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { registerProcess } from "~/core/domain/processes/auth/register.process";
import { User } from "~/core/entity/models/user";
import { withRequestValidation } from "~/core/gateway/middleware";
import { try_ } from "~/core/gateway/utilities";
import { passwordSchema } from "~/core/gateway/schemas";

var dtoSchema = {
  request: User.schema
    .pick(["first_name", "last_name", "username", "email"])
    .concat(
      t.object({
        password: passwordSchema,
        password_confirmation: t
          .string()
          .oneOf([t.ref("password")], T.match)
          .required(T.required)
          .typeError(T.typeString),
      }),
    ),
};

export async function registerController(dto) {
  return try_(
    applyMiddlewares(dto)(withRequestValidation(dtoSchema.request))(
      registerProcess,
    ),
  );
}
