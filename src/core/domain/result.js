/**
 * Result of some operation.
 */
export var RESULT = (options = {}) => ({
  message: options.message || undefined,
  data: options.data || null,
});
