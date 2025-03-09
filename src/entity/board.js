import * as t from "yup";

export var BoardSchema = t.object({
  id: t.number().required(),
  name: t.string().required(),
  description: t.string().nullable(),
  color: t.string().required(),
  is_archived: t.boolean().required(),
  created_at: t.date().required(),
  updated_at: t.date().required(),
});
