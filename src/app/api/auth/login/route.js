import { Either as E, Task } from "jello-fp";
import { loginController } from "~/core/gateway/controllers/auth/login.controller";
import { catch_, extractRequest, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var $task = Task.of(extractRequest(request))
    .map(E.chain(loginController))
    .map(forward_(200))
    .map(catch_())
    .join();

  return await $task();
}
