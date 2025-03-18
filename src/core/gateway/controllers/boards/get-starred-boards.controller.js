import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { Board } from "~/core/entity/models/board";
import { getStarredBoardsProcess } from "~/core/domain/processes/boards/get-starred-boards.process";
import {
  authenticate,
  mapUserId,
} from "~/core/gateway/authentication";
import { Result } from "~/core/domain/result";
import { validate } from "~/core/gateway/validators";

var dtoSchema = {
  response: Result.schema(
    t.array().of(Board.schema).required(),
  ).required(),
};

export async function getStarredBoardsController(dto) {
  var $task = Task.of(authenticate)
    .map(E.map(mapUserId))
    .map(E.chain(getStarredBoardsProcess))
    .map(E.chain(validate(dtoSchema.response)))
    .join();

  return await $task(dto);
}
