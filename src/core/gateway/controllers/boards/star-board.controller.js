import * as t from "yup";
import { compose, Either as E, mergeEach, Task } from "jello-fp";
import {
  authenticate,
  mapUserId,
} from "~/core/gateway/authentication";
import { validate } from "~/core/gateway/validators";
import { starBoardProcess } from "~/core/domain/processes/boards/star-board.process";

var dtoSchema = {
  request: t
    .object({
      board_id: t.number().required(),
    })
    .required(),
};

export async function starBoardController(dto) {
  var $authenticate = Task.of(authenticate).map(E.map(mapUserId));
  var $validateRequest = Task.of(validate(dtoSchema.request));

  var $task = Task.run($authenticate, $validateRequest)
    .map(E.chainAll(compose(starBoardProcess, mergeEach)))
    .join();

  return await $task(dto);
}
