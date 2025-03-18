import * as t from "yup";

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
};
