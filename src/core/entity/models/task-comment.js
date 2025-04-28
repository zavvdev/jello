import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { Id, Timestamp } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  body: t
    .string()
    .min(1, T.minLength)
    .required(T.required)
    .typeError(T.typeString),
  author_id: Id,
  task_id: Id,
  created_at: Timestamp,
  updated_at: Timestamp,
});

export var TaskComment = {
  schema,
  of: castModel(schema)("TaskComment"),
};
