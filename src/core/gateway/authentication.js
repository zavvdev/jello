import * as t from "yup";
import { Either as E, prop, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { validate } from "~/core/gateway/validators";
import { User } from "~/core/entity/models/user";
import { authenticateProcess } from "~/core/domain/processes/auth/authenticate.process";
import { Result } from "~/core/domain/result";

var dtoSchema = {
  request: t.object({
    session_token: t.string().required(T.required).typeError(T.typeString),
  }),
  response: Result.schema(User.schema.required()),
};

export function authenticate(dto) {
  return async () => {
    var $task = Task.of(() => validate(dtoSchema.request)(dto))
      .map(E.chain(authenticateProcess))
      .map(E.chain(validate(dtoSchema.response)))
      .map(E.map(prop("data")))
      .join();

    return await $task();
  };
}
