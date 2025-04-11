import { Result } from "~/core/domain/result";

export var handleConstraintError = (constraintsMap) => (error) => {
  if (error.constraint in constraintsMap) {
    return Result.of({
      message: constraintsMap[error.constraint],
    });
  } else {
    return null;
  }
};
