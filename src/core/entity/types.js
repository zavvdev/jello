import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";

export var Id = t.number().required(T.required).typeError(T.typeNumber);

export var CreatedAt = t.date().required(T.required).typeError(T.typeDate);

export var UpdatedAt = t.date().required(T.required).typeError(T.typeDate);
