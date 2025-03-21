import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { starBoardProcess } from "~/core/domain/processes/boards/star-board.process";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";

var dtoSchema = {
  request: t
    .object({
      board_id: t.number().required(),
    })
    .required(),
};

export async function starBoardController(dto) {
  return applyMiddlewares(dto)(
    withAuth,
    withRequestValidation(dtoSchema.request),
  )(async (user, request) => {
    return await starBoardProcess({
      user_id: user.id,
      board_id: request.board_id,
    });
  });
}
