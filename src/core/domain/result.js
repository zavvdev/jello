import * as t from "yup";

/**
 * Result of some operation.
 */
export var Result = {
  schema: (data) =>
    t.object({
      message: t.string().nullable(),
      data,
    }),
  of: (options = {}) => ({
    message: options.message || undefined,
    data: options.data || null,
  }),
};
