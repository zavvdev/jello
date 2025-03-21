import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { Either as E, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { Board } from "~/core/entity/models/board";
import { Result } from "~/core/domain/result";
import {
  withAuth,
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { UserRole } from "~/core/entity/models/user";
import {
  getBoardsProcess,
  sortableFields,
} from "~/core/domain/processes/boards/get-boards-process";
import { authSchema, sortOrderSchema } from "~/core/gateway/schemas";

var dtoSchema = {
  request: authSchema.concat(
    t.object({
      role: UserRole.schema.notRequired(),
      archived: t.boolean().typeError(T.typeBoolean).notRequired(),
      search: t.string().typeError(T.typeString).notRequired(),
      sort_by: t
        .string()
        .oneOf(sortableFields, T.invalid)
        .notRequired(),
      sort_order: sortOrderSchema.notRequired(),
    }),
  ),
  response: Result.schema(
    t.array().of(Board.schema).required(),
  ).required(),
};

export async function getBoardsController(dto) {
  return applyMiddlewares(dto)(
    withAuth,
    withRequestValidation(dtoSchema.request),
    withResponseValidator(dtoSchema.response),
  )(async (user, request, validateResponse) => {
    var assignDefaults = (dto) => ({
      role: dto.role ?? undefined,
      is_archived: dto.archived ?? false,
      search: dto.search ?? undefined,
      sort_by: dto.sort_by ?? sortableFields[0],
      sort_order: dto.sort_order ?? "desc",
    });

    var $task = Task.of(getBoardsProcess)
      .map(E.chain(validateResponse))
      .join();

    return await $task({
      user_id: user.id,
      ...assignDefaults(request),
    });
  });
}
