import { Either as E, Task } from "jello-fp";
import { logoutController } from "~/core/gateway/controllers/auth/logout.controller";
import {
  catch_,
  extractRequest,
  forward_,
} from "~/app/api/utilities";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function POST(request) {
  var $task = Task.of(extractRequest)
    .map(E.chain(logoutController))
    .map(forward_(200))
    .map(catch_())
    .join();

  return await $task(request);
}
