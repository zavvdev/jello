import { errorReporterService } from "~/infra/services/error-reporter-service";
import { Either as E } from "~/app/utilities/fp";
import { API_MESSAGES } from "~/app/api/config";

/**
 * @param {import("next/server").NextRequest} request
 */
export var extractRequest = (request) => async () => {
  try {
    var res = await request.json();
    return E.right(res);
  } catch {
    return E.left();
  }
};

export var validateRequest = (schema) =>
  E.chain(async (extractedBody) => {
    try {
      var validBody = await schema.validate(extractedBody, {
        strict: true,
      });
      return E.right(validBody);
    } catch (e) {
      return E.left({
        status: 400,
        message: API_MESSAGES.validationError,
        data: {
          [e.path]: e.message,
        },
      });
    }
  });

export var validateResponse = (schema) =>
  E.chain(async (responseData) => {
    try {
      var validData = await schema.validate(responseData, {
        strict: true,
      });
      return E.right(validData);
    } catch (e) {
      errorReporterService.report({
        message: e.message,
        error: e,
        location: "api/validateResponse",
      });
      return E.left();
    }
  });
