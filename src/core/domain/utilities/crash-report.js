import { crashReportService } from "~/core/infrastructure/services/crash-report.service";

export function reportCriticalAppError(error) {
  crashReportService.report({
    message: "Application critical error",
    error,
  });
}
