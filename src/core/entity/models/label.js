import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Color, CreatedAt, Id, UpdatedAt } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  name: t
    .string()
    .min(1, T.minLength)
    .max(16, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  color: Color.required(T.required),
  board_id: Id,
  created_at: CreatedAt,
  updated_at: UpdatedAt,
});

export var Label = {
  schema,
  of: castModel(schema)("Label"),
};
