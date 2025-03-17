import * as t from "yup";
import { Either as E, prop, Task } from "jello-fp";
import { Board } from "~/core/entity/models/board";
import { getStarredBoardsProcess } from "~/core/domain/processes/boards/get-starred-boards.process";
import { authenticate } from "~/core/gateway/authentication";
import { Result } from "~/core/domain/result";
import { validate } from "~/core/gateway/validators";

var dtoSchema = {
  response: Result.schema(t.array().of(Board.schema).required()),
};

export async function getStarredBoardsController(dto) {
  var toProcessDto = (id) => ({ user_id: id });

  var $task = Task.of(authenticate(dto))
    .map(E.map(prop("id")))
    .map(E.map(toProcessDto))
    .map(E.chain(getStarredBoardsProcess))
    .map(E.chain(validate(dtoSchema.response)))
    .join();

  return await $task();
}
