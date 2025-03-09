import "server-only";

import { UserSchema } from "~/entity/user";
import { db } from "~/infra/database";
import { createDtoSchema } from "./schemas";

export class SessionsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{ user_id: number, token: string }} dto
   */
  async create(dto) {
    var { user_id, token } = createDtoSchema.validateSync(dto, {
      strings: true,
    });

    await this.#client.query(
      `INSERT INTO sessions (
          user_id,
          token
       ) VALUES ($1, $2)`,
      [user_id, token],
    );
  }

  /**
   * @param {string} token
   */
  async getUserFromSession(token) {
    var revoked = await this.#client.query(
      "SELECT token from revoked_tokens WHERE token = $1",
      [token],
    );

    if (revoked.rows.length > 0) {
      return null;
    }

    var session = await this.#client.query(
      "SELECT user_id FROM sessions WHERE token = $1 AND expires_at > NOW()",
      [token],
    );

    var userId = session.rows[0]?.user_id;

    if (!userId) {
      return null;
    }

    var result = await this.#client.query(
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

export var sessionsRepo = new SessionsRepo(db);
