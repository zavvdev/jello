import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { crashReportService } from "../infrastructure/services/crash-report.service";

export var try_ = async (promise) => {
  try {
    return await promise;
  } catch (e) {
    crashReportService.report({
      message: e.message,
      location: "gateway/utilities.js@try_",
      error: e,
    });
    return E.left(
      Result.of({
        message: MESSAGES.unexpectedError,
      }),
    );
  }
};
