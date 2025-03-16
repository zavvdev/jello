import { Either as E, Task } from "jello-fp";
import { registerController } from "~/core/gateway/controllers/auth/register.controller";
import { catch_, extractRequest, forward_ } from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var $task = Task.of(extractRequest(request))
    .map(E.chain(registerController))
    .map(forward_(201))
    .map(catch_())
    .join();

  return await $task();
}
