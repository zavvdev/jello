import "server-only";

import * as t from "yup";
import { Either as E, Task } from "jello-fp";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { loginProcess } from "~/core/domain/processes/auth/login.process";
import { Result } from "~/core/domain/result";
import {
  withRequestValidation,
  withResponseValidator,
} from "~/core/gateway/middleware";
import { try_ } from "~/core/gateway/utilities";

var dtoSchema = {
  request: t.object({
    usernameOrEmail: t
      .string()
      .required(T.required)
      .typeError(T.typeString),
    password: t.string().required(T.required).typeError(T.typeString),
  }),
  response: Result.schema(
    t.object({
      token: t.string().required(),
    }),
  ),
};

export async function loginController(dto) {
  return try_(
    applyMiddlewares(dto)(
      withRequestValidation(dtoSchema.request),
      withResponseValidator(dtoSchema.response),
    )(async (request, validateResponse) => {
      var $task = Task.of(loginProcess)
        .map(E.chain(validateResponse))
        .join();

      return await $task(request);
    }),
  );
}
