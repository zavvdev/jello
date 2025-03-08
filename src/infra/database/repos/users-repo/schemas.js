import * as t from "yup";
import { UserSchema } from "~/entity/user";

export var createDtoSchema = UserSchema.omit([
  "id",
  "bio",
  "created_at",
  "updated_at",
]).concat(
  t.object({
    password: t.string().required(),
  }),
);

export var existsDtoSchema = t.object({
  username: t.string().required(),
  email: t.string().email().required(),
});
