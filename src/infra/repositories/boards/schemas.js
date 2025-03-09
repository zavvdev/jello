import * as t from "yup";
import { BoardSchema } from "~/entity/board";

// Get all

export var getAllDtoSchema = {
  request: t.object({
    userId: t.number().required(),
  }),
  response: t.array().of(BoardSchema).required(),
};
