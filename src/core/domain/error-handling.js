import { crashReportService } from "~/core/infrastructure/services/crash-report.service";

export function handleGatewayError(error, location) {
  crashReportService.report({
    error,
    location: `Gateway: ${location}`,
  });
}

export function handleClientError(error, location) {
  crashReportService.report({
    error,
    location: `Client: ${location}`,
  });
}
