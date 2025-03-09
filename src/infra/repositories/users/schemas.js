import * as t from "yup";
import { UserSchema } from "~/entity/user";

export var createDtoSchema = {
  request: UserSchema.omit(["id", "bio", "created_at", "updated_at"]).concat(
    t.object({
      password: t.string().required(),
    }),
  ),
};

// Exists

export var existsDtoSchema = {
  request: t.object({
    username: t.string().required(),
    email: t.string().email().required(),
  }),
  response: t.object({
    byUsername: t.boolean().required(),
    byEmail: t.boolean().required(),
  }),
};

// Get by credentials

export var getByCredentialsDtoSchema = {
  request: t.object({
    usernameOrEmail: t.string().required(),
    password: t.string().required(),
  }),
  response: t.object({
    id: t.number().required(),
  }),
};

// Get by session token

export var getBySessionTokenDtoSchema = {
  request: t.object({
    token: t.string().required(),
  }),
  response: UserSchema,
};
