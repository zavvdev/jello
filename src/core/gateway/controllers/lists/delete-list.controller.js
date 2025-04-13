import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { deleteListProcess } from "~/core/domain/processes/lists/delete-list.process";

var dtoSchema = {
  request: authSchema.concat(
    t
      .object({
        board_id: Id,
        id: Id,
      })
      .required(),
  ),
};

export async function deleteListController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await deleteListProcess({
        user_id: user.id,
        board_id: request.board_id,
        id: request.id,
      });
    }),
  );
}
