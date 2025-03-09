import * as t from "yup";
import { BoardSchema } from "~/entity/board";

// Get all

export var getAllDtoSchema = {
  request: t.object({
    withArchived: t.boolean().nullable(),
  }),
  response: t.array().of(BoardSchema).required(),
};
