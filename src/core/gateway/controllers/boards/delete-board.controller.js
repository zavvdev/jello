import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { deleteBoardProcess } from "~/core/domain/processes/boards/delete-board.process";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";

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

export async function deleteBoardController(dto) {
  return applyMiddlewares(dto)(
    withAuth,
    withRequestValidation(dtoSchema.request),
  )(async (user, request) => {
    return await deleteBoardProcess({
      user_id: user.id,
      board_id: request.board_id,
    });
  });
}
