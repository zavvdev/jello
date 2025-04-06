import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { archiveBoardProcess } from "~/core/domain/processes/boards/archive-board.process";

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

export async function archiveBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await archiveBoardProcess({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
