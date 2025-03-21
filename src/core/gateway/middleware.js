import { MiddlewareError } from "jello-utils";
import { MESSAGES } from "jello-messages";
import { Either as E } from "jello-fp";
import { Result } from "~/core/domain/result";
import { authenticateProcess } from "~/core/domain/processes/auth/authenticate.process";
import { authSchema } from "./schemas";

export async function withAuth(dto) {
  try {
    var data = authSchema.validateSync(dto, { strict: true });
    var result = await authenticateProcess(data);

    if (result.isRight) {
      return result.join();
    } else {
      throw new Error();
    }
  } catch {
    throw new MiddlewareError(
      "Auth Middleware Error",
      E.left(
        Result.of({
          message: MESSAGES.unauthorized,
        }),
      ),
    );
  }
}

export function withRequestValidation(schema) {
  return async (dto) => {
    try {
      var data = schema.validateSync(dto, { strict: true });
      return data;
    } catch (e) {
      throw new MiddlewareError(
        "Validation Middleware Error",
        E.left(
          Result.of({
            message: MESSAGES.validationError,
            data:
              e.path && e.message
                ? {
                    [e.path]: e.message,
                  }
                : null,
          }),
        ),
      );
    }
  };
}

export function withResponseValidator(schema) {
  return async () => async (data) => {
    try {
      var validData = await schema.validate(data, {
        strict: true,
      });
      return E.right(validData);
    } catch {
      return E.left();
    }
  };
}
