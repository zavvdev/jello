import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { unstarBoardProcess } from "~/core/domain/processes/boards/unstar-board.process";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";

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

export async function unstarBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await unstarBoardProcess({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
