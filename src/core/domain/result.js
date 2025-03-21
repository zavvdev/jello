import * as t from "yup";
import { Either as E } from "jello-fp";

/**
 * Result of some operation.
 */
export var Result = {
  schema: (dataSchema) =>
    t.object({
      message: t.string().nullable(),
      data: dataSchema,
    }),
  of: (options = {}) => ({
    message: options.message || undefined,
    data: options.data || null,
  }),
  fromEither: (eith) =>
    eith.isRight ? E.right(Result.of({ data: eith.join() })) : eith,
};
