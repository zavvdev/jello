import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { Either as E, prop, Task } from "jello-fp";
import { validate } from "~/core/gateway/validators";
import { User } from "~/core/entity/models/user";
import { authenticateProcess } from "~/core/domain/processes/auth/authenticate.process";

var dtoSchema = {
  request: t.object({
    session_token: t
      .string()
      .required(T.required)
      .typeError(T.typeString),
  }),
  response: User.schema.required(),
};

export async function authenticate(dto) {
  var $task = Task.of(validate(dtoSchema.request))
    .map(E.chain(authenticateProcess))
    .map(E.map(prop("data")))
    .map(E.chain(validate(dtoSchema.response)))
    .join();

  return await $task(dto);
}

export var mapUserId = (user) => ({ user_id: user.id });
