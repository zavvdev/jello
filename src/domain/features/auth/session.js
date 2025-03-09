import "server-only";

import { cookies } from "next/headers";
import { sessionsRepo } from "~/infra/database/repos/sessions-repo";

export async function getSession() {
  var token = cookies().get(process.env.COOKIE_NAME)?.value;

  if (typeof token === "string") {
    return await sessionsRepo.getUserFromSession(token);
  }

  return null;
}
