import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { List } from "~/core/entity/models/list";
import { createListProcess } from "~/core/domain/processes/lists/create-list.process";

var dtoSchema = {
  request: authSchema.concat(List.schema.pick(["board_id", "name"])),
};

export async function createListController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await createListProcess({
        user_id: user.id,
        board_id: request.board_id,
        name: request.name,
      });
    }),
  );
}
