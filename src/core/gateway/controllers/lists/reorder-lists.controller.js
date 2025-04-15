import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Id } from "~/core/entity/types";
import { reorderListsProcess } from "~/core/domain/processes/lists/reorder-lists.process";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      board_id: Id,
      lists_order: t.array(Id).required(),
    }),
  ),
};

export async function reorderListsController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await reorderListsProcess({
        user_id: user.id,
        board_id: request.board_id,
        lists_order: request.lists_order,
      });
    }),
  );
}
