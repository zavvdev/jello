import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { List } from "~/core/entity/models/list";
import { updateListProcess } from "~/core/domain/processes/lists/update-list.process";

var dtoSchema = {
  request: authSchema.concat(
    List.schema.pick(["id", "board_id", "name"]),
  ),
};

export async function updateListController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await updateListProcess({
        user_id: user.id,
        board_id: request.board_id,
        id: request.id,
        name: request.name,
      });
    }),
  );
}
