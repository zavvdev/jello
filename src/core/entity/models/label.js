import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Color, Id, Timestamp } from "~/core/entity/types";

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
  created_at: Timestamp,
  updated_at: Timestamp,
});

export var Label = {
  schema,
  of: castModel(schema)("Label"),
};
