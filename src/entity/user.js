import * as t from "yup";

export var UserSchema = t.object({
  id: t.number().required(),
  username: t.string().required(),
  first_name: t.string().required(),
  last_name: t.string().required(),
  email: t.string().email().required(),
  bio: t.string().nullable(),
  created_at: t.string().required(),
  updated_at: t.string().required(),
});
