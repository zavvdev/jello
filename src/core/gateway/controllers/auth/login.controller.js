import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { validate } from "~/core/gateway/validators";
import { loginProcess } from "~/core/domain/processes/auth/login.process";
import { Result } from "~/core/domain/result";

var dtoSchema = {
  request: t.object({
    usernameOrEmail: t.string().required(T.required).typeError(T.typeString),
    password: t.string().required(T.required).typeError(T.typeString),
  }),
  response: Result.schema(
    t.object({
      token: t.string().required(),
    }),
  ),
};

export async function loginController(dto) {
  var $task = Task.of(() => validate(dtoSchema.request)(dto))
    .map(E.chain(loginProcess))
    .map(E.chain(validate(dtoSchema.response)))
    .join();

  return await $task();
}
