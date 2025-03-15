import * as t from "yup";
import { usersRepo } from "~/infra/repositories/users";
import { sessionsRepo } from "~/infra/repositories/sessions";
import {
  API_MESSAGES,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  API_VALIDATION_MESSAGES as T,
} from "~/app/api/config";
import { Either as E, Task } from "~/app/utilities/fp";
import {
  extractRequest,
  validateRequest,
  validateResponse,
} from "~/app/api/utilities";

var postSchema = {
  request: t.object({
    usernameOrEmail: t.string().required(T.required).typeError(T.typeString),
    password: t.string().required(T.required).typeError(T.typeString),
  }),
  response: t.object({
    token: t.string().required(),
  }),
};

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var checkExistance = E.chain(async (body) => {
    try {
      var user = await usersRepo.getByCredentials({
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });

      if (!user?.id) {
        return E.left({
          message: API_MESSAGES.invalid_credentials,
          status: 400,
        });
      }

      return E.right(user);
    } catch {
      return E.left();
    }
  });

  var createSession = E.chain(async (user) => {
    try {
      var token = await sessionsRepo.create({ user_id: user.id });
      return E.right({ token });
    } catch {
      return E.left();
    }
  });

  var success = E.chain((response) => SUCCESS_RESPONSE({ data: response }));
  var terminate = E.chainLeft((error) => ERROR_RESPONSE(error));

  var $loginUser = Task.of(extractRequest(request))
    .map(validateRequest(postSchema.request))
    .map(checkExistance)
    .map(createSession)
    .map(validateResponse(postSchema.response))
    .map(success)
    .map(terminate)
    .join();

  return await $loginUser();
}
