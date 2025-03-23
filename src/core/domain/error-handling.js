import { crashReportService } from "../infrastructure/services/crash-report.service";

export function handleGatewayError(error, location) {
  crashReportService.report({
    error,
    location: `Gateway: ${location}`,
  });
}
