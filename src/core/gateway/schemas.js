import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";

export var authSchema = t.object({
  session_token: t
    .string()
    .required(T.required)
    .typeError(T.typeString),
});

export var sortOrderSchema = t
  .string()
  .oneOf(["asc", "desc"], T.invalid);
