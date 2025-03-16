import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { RESULT } from "~/core/domain/result";

export var validateDto = (schema) => (dto) => async () => {
  try {
    var validDto = await schema.validate(dto, {
      strict: true,
    });
    return E.right(validDto);
  } catch (e) {
    return E.left(
      RESULT({
        message: MESSAGES.validationError,
        data: {
          [e.path]: e.message,
        },
      }),
    );
  }
};

export var validateResultData = (schema) => async (result) => {
  try {
    await schema.validate(result?.data, {
      strict: true,
    });
    return E.right(result);
  } catch (e) {
    return E.left(
      RESULT({
        message: MESSAGES.validationError,
        data: {
          [e.path]: e.message,
        },
      }),
    );
  }
};
