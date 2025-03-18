import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { CreatedAt, Id, UpdatedAt } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  name: t
    .string()
    .min(2, T.minLength)
    .max(32, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  description: t.string().max(100, T.maxLength).nullable(),
  color: t
    .string()
    .matches(/^#[0-9a-fA-F]{6}$/, T.invalid)
    .required(T.required)
    .typeError(T.typeString),
  is_archived: t
    .boolean()
    .required(T.required)
    .typeError(T.typeBoolean),
  created_at: CreatedAt,
  updated_at: UpdatedAt,
});

export var Board = {
  schema,
  of: castModel(schema)("Board"),
};
