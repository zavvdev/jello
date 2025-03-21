import * as t from "yup";
import { applyMiddlewares } from "jello-utils";
import { VALIDATION_MESSAGES as T } from "jello-messages";
import { logoutProcess } from "~/core/domain/processes/auth/logout.process";
import { withRequestValidation } from "~/core/gateway/middleware";

var dtoSchema = {
  request: t.object({
    token: t.string().required(T.required),
  }),
};

export async function logoutController(dto) {
  return applyMiddlewares(dto)(
    withRequestValidation(dtoSchema.request),
  )(logoutProcess);
}
