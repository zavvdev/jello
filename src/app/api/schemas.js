import * as t from "yup";
import { API_VALIDATION_MESSAGES as T } from "~/app/api/config";

export var usernameSchema = t
  .string()
  .min(2, T.lengthInsufficient)
  .max(16, T.lengthExceeded)
  .matches(/^[a-z0-9_]*$/, T.notAllowedSymbols)
  .typeError(T.typeString);
