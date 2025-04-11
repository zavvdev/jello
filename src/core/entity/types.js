import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";

export var Id = t
  .number()
  .required(T.required)
  .typeError(T.typeNumber);

export var Timestamp = t.mixed().test({
  message: T.typeDate,
  test: (value) => {
    return (
      value instanceof Date ||
      new Date(value).toTimeString() !== "Invalid Date"
    );
  },
});

export var Color = t
  .string()
  .matches(/^#[0-9a-fA-F]{6}$/, T.invalid)
  .typeError(T.typeString);

export var OrderIndex = t
  .number()
  .required(T.required)
  .typeError(T.typeNumber);
