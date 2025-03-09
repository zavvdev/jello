import * as t from "yup";

// Create

export var createDtoSchema = {
  request: t.object({
    user_id: t.number().required(),
  }),
};

// Destroy

export var destroyDtoSchema = {
  request: t.object({
    token: t.string().required(),
  }),
};
