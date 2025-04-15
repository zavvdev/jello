import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Id, OrderIndex, Timestamp } from "~/core/entity/types";
import { Task } from "./task";

var schema = t.object({
  id: Id,
  name: t
    .string()
    .min(1, T.minLength)
    .max(16, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  board_id: Id,
  order_index: OrderIndex,
  tasks: t.array().of(Task.schema).required(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export var List = {
  schema,
  of: castModel(schema)("List"),
};
