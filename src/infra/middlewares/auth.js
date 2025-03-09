import "server-only";

import { cookies } from "next/headers";
import { UserSchema } from "~/entity/user";
import { db } from "~/infra/database";

export class AuthMiddleware {
  constructor() {
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        var originalMethod = target[prop];

        if (typeof originalMethod === "function" && prop !== "#auth") {
          return async function (...args) {
            var user = await target.#auth();

            if (!user) {
              throw new Error("unauthorized");
            }

            return originalMethod.apply(receiver, [user, ...args]);
          };
        }

        return originalMethod;
      },
    });
  }

  async #auth() {
    var cookieStorage = await cookies();
    var token = cookieStorage.get(process.env.COOKIE_NAME)?.value;

    var revoked = await db.query(
      "SELECT token from revoked_tokens WHERE token = $1",
      [token],
    );

    if (revoked.rows.length > 0) {
      return null;
    }

    var session = await db.query(
      "SELECT user_id FROM sessions WHERE token = $1 AND expires_at > NOW()",
      [token],
    );

    var userId = session.rows[0]?.user_id;

    if (!userId) {
      return null;
    }

    var result = await db.query(
      `SELECT
        id, first_name, last_name, username, email, bio, created_at, updated_at
        FROM users WHERE id = $1`,
      [userId],
    );

    var user = result.rows[0];

    if (!user) {
      return null;
    }

    return UserSchema.validateSync(result.rows[0], { strict: true });
  }
}
