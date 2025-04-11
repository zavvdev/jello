import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import {
  CreatedAt,
  Id,
  OrderIndex,
  UpdatedAt,
} from "~/core/entity/types";

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
  created_at: CreatedAt,
  updated_at: UpdatedAt,
});

export var List = {
  schema,
  of: castModel(schema)("List"),
};
