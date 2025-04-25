import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Id, OrderIndex, Timestamp } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  name: t
    .string()
    .min(1, T.minLength)
    .max(64, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  description: t.string().nullable(),
  list_id: Id,
  order_index: OrderIndex,
  created_by: Id.nullable(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export var Task = {
  schema,
  of: castModel(schema)("Task"),
};
