import * as t from "yup";
import { Either as E, prop, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { validateDto, validateResultData } from "~/core/gateway/validators";
import { User } from "~/core/entity/models/user";
import { authenticateProcess } from "~/core/domain/processes/auth/authenticate.process";

var dtoSchema = {
  request: t.object({
    session_token: t.string().required(T.required).typeError(T.typeString),
  }),
  response: User.schema.required(),
};

export function authenticate(dto) {
  return async () => {
    var $task = Task.of(validateDto(dtoSchema.request)(dto))
      .map(E.chain(authenticateProcess))
      .map(E.chain(validateResultData(dtoSchema.response)))
      .map(E.map(prop("data")))
      .join();

    return await $task();
  };
}
