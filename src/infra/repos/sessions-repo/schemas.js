import * as t from "yup";

export var createDtoSchema = t.object({
  user_id: t.number().required(),
});
