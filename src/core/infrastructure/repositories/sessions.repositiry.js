import "server-only";

import { Either as E } from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { encryptionService } from "~/core/infrastructure/services/encryption.service";

export class SessionsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  user_id: number;
   * }} param0
   */
  async create({ user_id }) {
    try {
      var token = encryptionService.getUniqueId();

      await this.#client.query(
        `INSERT INTO sessions (
          user_id,
          token
       ) VALUES ($1, $2)`,
        [user_id, token],
      );

      return E.right(token);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async destroy({ token }) {
    try {
      await db.transaction(async (client) => {
        var sessionTokenResult = await client.query(
          `SELECT token FROM sessions WHERE token = $1`,
          [token],
        );

        var sessionToken = sessionTokenResult.rows[0]?.token;

        if (sessionToken) {
          await client.query(
            `INSERT INTO revoked_tokens (token) VALUES ($1)`,
            [sessionToken],
          );
          await client.query(
            `DELETE FROM sessions WHERE token = $1`,
            [sessionToken],
          );
        } else {
          throw new Error("session_not_found");
        }
      });

      return E.right();
    } catch {
      return E.left();
    }
  }
}

export var sessionsRepo = new SessionsRepo(db);
