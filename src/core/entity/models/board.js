import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Color, Id, Timestamp } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  name: t
    .string()
    .min(2, T.minLength)
    .max(32, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  description: t.string().max(100, T.maxLength).nullable(),
  color: Color.required(T.required),
  is_archived: t
    .boolean()
    .required(T.required)
    .typeError(T.typeBoolean),
  is_favorite: t
    .boolean()
    .required(T.required)
    .typeError(T.typeBoolean),
  role: t.string().required(T.required).typeError(T.typeString),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export var Board = {
  schema,
  of: castModel(schema)("Board"),
};
