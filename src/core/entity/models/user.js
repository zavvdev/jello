import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { castModel } from "~/core/entity/validation";
import { CreatedAt, Id, UpdatedAt } from "~/core/entity/types";

var schema = t.object({
  id: Id,
  username: t
    .string()
    .min(2, T.minLength)
    .max(16, T.maxLength)
    .matches(/^[a-z0-9_]*$/, T.invalid)
    .required(T.required)
    .typeError(T.typeString),
  first_name: t
    .string()
    .max(32, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  last_name: t
    .string()
    .max(32, T.maxLength)
    .required(T.required)
    .typeError(T.typeString),
  email: t
    .string()
    .email(T.invalid)
    .required(T.required)
    .typeError(T.typeString),
  bio: t.string().nullable().typeError(T.typeString),
  created_at: CreatedAt,
  updated_at: UpdatedAt,
});

var ROLES = ["owner", "admin", "member"];

export var User = {
  schema,
  of: castModel(schema)("User"),
  canDeleteBoard: (role) => role === ROLES[0],
  canEditBoard: (role) => [ROLES[0], ROLES[1]].includes(role),
};

export var UserRole = {
  Owner: ROLES[0],
  Admin: ROLES[1],
  Member: ROLES[2],
  schema: t.string().oneOf(ROLES, T.invalid),
  exists: (x) => ROLES.includes(x),
  of: (x) =>
    ({
      [ROLES[0]]: ROLES[0],
      [ROLES[1]]: ROLES[1],
      [ROLES[2]]: ROLES[2],
    })[x],
};
