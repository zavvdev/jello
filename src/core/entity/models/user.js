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

export var User = {
  schema,
  of: castModel(schema)("User"),
};

var userRoles = ["owner", "admin", "member"];

export var UserRole = {
  Owner: userRoles[0],
  Admin: userRoles[1],
  Member: userRoles[2],
  schema: t.string().oneOf(userRoles, T.invalid),
  exists: (x) => userRoles.includes(x),
  of: (x) =>
    ({
      [userRoles[0]]: userRoles[0],
      [userRoles[1]]: userRoles[1],
      [userRoles[2]]: userRoles[2],
    })[x],
};
