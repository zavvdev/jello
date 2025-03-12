import { Either as E } from "~/app/utilities/fp";
import { API_MESSAGES } from "~/app/api/config";

/**
 * @param {import("next/server").NextRequest} request
 */
export var extractBody = (request) => async () => {
  try {
    var res = await request.json();
    return E.right(res);
  } catch {
    return E.left();
  }
};

export var validateBody = (schema) =>
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
