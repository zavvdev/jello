import { errorReporterService } from "~/infra/services/error-reporter-service";

export function reportCriticalAppError(error) {
  errorReporterService.report({
    message: "Application critical error",
    error,
  });
}
