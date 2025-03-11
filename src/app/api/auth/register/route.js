import * as t from "yup";
import { usersRepo } from "~/infra/repositories/users";
import {
  API_MESSAGES,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  API_VALIDATION_MESSAGES as T,
} from "~/app/api/config";
import { usernameSchema } from "~/app/api/schemas";
import { Either as E, Task } from "~/app/utilities/fp";
import { extractBody, validateBody } from "~/app/api/utilities";

var postSchema = {
  request: t.object({
    first_name: t
      .string()
      .max(32, T.lengthExceeded)
      .required(T.required)
      .typeError(T.typeString),
    last_name: t
      .string()
      .max(32, T.lengthExceeded)
      .required(T.required)
      .typeError(T.typeString),
    username: usernameSchema.required(T.required),
    email: t
      .string()
      .email(T.invalidEmail)
      .required(T.required)
      .typeError(T.typeString),
    password: t
      .string()
      .min(8, T.lengthInsufficient)
      .required(T.required)
      .typeError(T.typeString),
  }),
};

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var checkExistance = E.chain(async (body) => {
    try {
      var isExists = await usersRepo.exists({
        username: body.username,
        email: body.email,
      });

      if (isExists.byEmail) {
        return E.left({
          message: API_MESSAGES.emailExists,
          status: 400,
        });
      } else if (isExists.byUsername) {
        return E.left({
          message: API_MESSAGES.usernameExists,
          status: 400,
        });
      }

      return E.right(body);
    } catch {
      return E.left();
    }
  });

  var createUser = E.chain(async (body) => {
    try {
      await usersRepo.create(body);
      return E.right();
    } catch {
      return E.left();
    }
  });

  var success = E.chain(() => SUCCESS_RESPONSE({ status: 201 }));
  var terminate = E.chainLeft((error) => ERROR_RESPONSE(error));

  var $registerUser = Task.of(extractBody(request))
    .map(validateBody(postSchema.request))
    .map(checkExistance)
    .map(createUser)
    .map(success)
    .map(terminate)
    .join();

  return await $registerUser();
}
