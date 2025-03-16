import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { validateDto, validateResultData } from "~/core/gateway/validators";
import { loginProcess } from "~/core/domain/processes/auth/login.process";

var dtoSchema = {
  request: t.object({
    usernameOrEmail: t.string().required(T.required).typeError(T.typeString),
    password: t.string().required(T.required).typeError(T.typeString),
  }),
  response: t.object({
    token: t.string().required(),
  }),
};

export async function loginController(dto) {
  var $task = Task.of(validateDto(dtoSchema.request)(dto))
    .map(E.chain(loginProcess))
    .map(E.chain(validateResultData(dtoSchema.response)))
    .join();

  return await $task();
}
