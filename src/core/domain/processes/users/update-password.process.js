import { Either as E, head, Task } from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { SessionsRepo } from "~/core/infrastructure/repositories/sessions.repository";
import { UsersRepo } from "~/core/infrastructure/repositories/users.repository";

/**
 * @param {{
 *  user_id: number;
 *  username: string;
 *  old_password: string;
 *  new_password: string;
 * }} dto
 */
export async function updatePasswordProcess(dto) {
  return db.transaction(async (client) => {
    var usersRepo = new UsersRepo(client);
    var sessionsRepo = new SessionsRepo(client);

    var $revoke = (session) =>
      Task.of(() => sessionsRepo.revoke(session)).map(
        E.chain(sessionsRepo.destroy.bind(sessionsRepo)),
      );

    var revokeAll = (sessions) =>
      Task.all(...sessions.map($revoke))
        .map(E.all(head))
        .run();

    var $checkCredentials = Task.of((dto) =>
      usersRepo.getByCredentials({
        usernameOrEmail: dto.username,
        password: dto.old_password,
      }),
    );

    var $task = Task.all(Task.of(E.asyncRight), $checkCredentials)
      .map(E.all(head))
      .map(E.chain(usersRepo.updatePassword.bind(usersRepo)))
      .map(E.chain(sessionsRepo.getActiveSessions.bind(sessionsRepo)))
      .map(E.chain(revokeAll))
      .join();

    return await $task(dto);
  });
}
