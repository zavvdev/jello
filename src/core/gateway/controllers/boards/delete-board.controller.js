import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { deleteBoardProcess } from "~/core/domain/processes/boards/delete-board.process";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";

var dtoSchema = {
  request: authSchema.concat(
    t
      .object({
        board_id: Id,
      })
      .required(),
  ),
};

export async function deleteBoardController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await deleteBoardProcess({
        user_id: user.id,
        board_id: request.board_id,
      });
    }),
  );
}
