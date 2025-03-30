import "server-only";

import { Either as E, Task } from "jello-fp";
import { SessionsRepo } from "~/core/infrastructure/repositories/sessions.repository";
import { db } from "~/core/infrastructure/database";

/**
 * @param {{
 *  token: string;
 * }} dto
 */
export async function logoutProcess(dto) {
  return db.transaction(async (client) => {
    var repo = new SessionsRepo(client);

    var $task = Task.of(repo.exists.bind(repo))
      .map(E.chain(repo.revoke.bind(repo)))
      .map(E.chain(repo.destroy.bind(repo)))
      .join();

    return await $task(dto);
  });
}
