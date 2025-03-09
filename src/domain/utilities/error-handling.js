import { errorReporterService } from "~/infra/services/error-reporter-service";

export function reportCriticalAppError(error) {
  errorReporterService.report({
    message: "Application critical error",
    error,
  });
}

/**
 * @param {Object} errors
 * @param {Function} fn
 */
export function handleKnownError(errors, fn, location) {
  try {
    return fn();
  } catch (error) {
    var message = error.message;

    errorReporterService.report({
      message,
      error,
      location,
    });

    if (Object.values(errors).includes(message)) {
      throw new Error(message);
    } else {
      throw new Error("unexpected_error");
    }
  }
}
