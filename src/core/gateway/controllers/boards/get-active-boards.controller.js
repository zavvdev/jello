import * as t from "yup";
import { Either as E, prop, Task } from "jello-fp";
import { validateResultData } from "~/core/gateway/validators";
import { Board } from "~/core/entity/models/board";
import { getActiveBoardsProcess } from "~/core/domain/processes/boards/get-active-boards.process";
import { authenticate } from "~/core/gateway/authentication";

var dtoSchema = {
  response: t.array().of(Board.schema).required(),
};

export async function getActiveBoardsController(dto) {
  var toProcessDto = (id) => ({ user_id: id });

  var $task = Task.of(authenticate(dto))
    .map(E.map(prop("id")))
    .map(E.map(toProcessDto))
    .map(E.chain(getActiveBoardsProcess))
    .map(E.chain(validateResultData(dtoSchema.response)))
    .join();

  return await $task();
}
