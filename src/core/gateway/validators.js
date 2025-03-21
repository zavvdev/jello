import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";

export var validate = (schema) => async (data) => {
  try {
    var validData = await schema.validate(data, {
      strict: true,
    });
    return E.right(validData);
  } catch (e) {
    return E.left(
      Result.of({
        message: MESSAGES.validationError,
        data:
          e.path && e.message
            ? {
                [e.path]: e.message,
              }
            : null,
      }),
    );
  }
};
