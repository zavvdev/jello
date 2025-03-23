import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { applyMiddlewares } from "jello-utils";
import { starBoardProcess } from "~/core/domain/processes/boards/star-board.process";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "../../schemas";

var dtoSchema = {
  request: authSchema.concat(
    t
      .object({
        board_id: t
          .number()
          .required(T.required)
          .typeError(T.typeNumber),
      })
      .required(),
  ),
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
