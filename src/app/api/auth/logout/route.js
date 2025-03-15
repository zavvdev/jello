import * as t from "yup";
import { sessionsRepo } from "~/infra/repositories/sessions";
import {
  API_MESSAGES,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  API_VALIDATION_MESSAGES as T,
} from "~/app/api/config";
import { Either as E, Task } from "~/app/utilities/fp";
import { extractRequest, validateRequest } from "~/app/api/utilities";

var postSchema = {
  request: t.object({
    token: t.string().required(T.token).typeError(T.typeString),
  }),
};

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var destroySession = E.chain(async (body) => {
    try {
      await sessionsRepo.destroy({ token: body.token });
      return E.right(body);
    } catch (e) {
      if (e.message === "session_not_found") {
        return E.left({ message: API_MESSAGES.not_found, status: 404 });
      }
      return E.left();
    }
  });

  var success = E.chain(() => SUCCESS_RESPONSE());
  var terminate = E.chainLeft((error) => ERROR_RESPONSE(error));

  var $logout = Task.of(extractRequest(request))
    .map(validateRequest(postSchema.request))
    .map(destroySession)
    .map(success)
    .map(terminate)
    .join();

  return await $logout();
}
