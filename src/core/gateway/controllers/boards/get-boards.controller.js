import * as t from "yup";
import { compose, Either as E, mergeEach, Task } from "jello-fp";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { Board } from "~/core/entity/models/board";
import {
  authenticate,
  mapUserId,
} from "~/core/gateway/authentication";
import { Result } from "~/core/domain/result";
import { sortOrderSchema, validate } from "~/core/gateway/validators";
import { UserRole } from "~/core/entity/models/user";
import {
  getBoardsProcess,
  sortableFields,
} from "~/core/domain/processes/boards/get-boards-process";

var dtoSchema = {
  request: t.object({
    role: UserRole.schema.notRequired(),
    archived: t.boolean().typeError(T.typeBoolean).notRequired(),
    search: t.string().typeError(T.typeString).notRequired(),
    sort_by: t
      .string()
      .oneOf(sortableFields, T.invalid)
      .notRequired(),
    sort_order: sortOrderSchema.notRequired(),
  }),
  response: Result.schema(
    t.array().of(Board.schema).required(),
  ).required(),
};

export async function getBoardsController(dto) {
  var assignDefaults = (dto) => ({
    role: dto.role ?? undefined,
    is_archived: dto.archived ?? false,
    search: dto.search ?? undefined,
    sort_by: dto.sort_by ?? sortableFields[0],
    sort_order: dto.sort_order ?? "desc",
  });

  var $getParams = Task.of(validate(dtoSchema.request)).map(
    E.map(assignDefaults),
  );

  var $authenticate = Task.of(authenticate).map(E.map(mapUserId));

  var $task = Task.run($authenticate, $getParams)
    .map(E.chainAll(compose(getBoardsProcess, mergeEach)))
    .map(E.chain(validate(dtoSchema.response)))
    .join();

  return await $task(dto);
}
