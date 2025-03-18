import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { registerProcess } from "~/core/domain/processes/auth/register.process";
import { User } from "~/core/entity/models/user";
import { validate } from "~/core/gateway/validators";

var dtoSchema = {
  request: User.schema
    .pick(["first_name", "last_name", "username", "email"])
    .concat(
      t.object({
        password: t
          .string()
          .min(8, T.minLength)
          .required(T.required)
          .typeError(T.typeString),
        password_confirmation: t
          .string()
          .oneOf([t.ref("password")], T.match)
          .required(T.required)
          .typeError(T.typeString),
      }),
    ),
};

export async function registerController(dto) {
  var $task = Task.of(validate(dtoSchema.request))
    .map(E.chain(registerProcess))
    .join();

  return await $task(dto);
}
