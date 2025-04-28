import { applyMiddlewares } from "jello-utils";
import {
  withAuth,
  withRequestValidation,
} from "~/core/gateway/middleware";
import { authSchema } from "~/core/gateway/schemas";
import { try_ } from "~/core/gateway/utilities";
import { Task as TaskModel } from "~/core/entity/models/task";
import { updateTaskProcess } from "~/core/domain/processes/tasks/update-task.process";

var dtoSchema = {
  request: authSchema.concat(
    TaskModel.schema.pick(["id", "name", "description", "list_id"]),
  ),
};

export async function updateTaskController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withAuth,
      withRequestValidation(dtoSchema.request),
    )(async (user, request) => {
      return await updateTaskProcess({
        user_id: user.id,
        id: request.id,
        name: request.name,
        description: request.description ?? null,
        list_id: request.list_id,
      });
    }),
  );
}
