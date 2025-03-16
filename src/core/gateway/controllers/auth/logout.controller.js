import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { validateDto } from "~/core/gateway/validators";
import { logoutProcess } from "~/core/domain/processes/auth/logout.process";

var dtoSchema = {
  request: t.object({
    token: t.string().required(T.required),
  }),
};

export async function logoutController(dto) {
  var $task = Task.of(validateDto(dtoSchema.request)(dto))
    .map(E.chain(logoutProcess))
    .join();

  return await $task();
}
