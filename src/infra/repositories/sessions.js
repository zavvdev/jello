import "server-only";

import { db } from "~/infra/database";
import { createSessionToken } from "~/infra/encryption/session";

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
   * @returns {Promise<string>}
   */
  async create({ user_id }) {
    var token = createSessionToken();

    await this.#client.query(
      `INSERT INTO sessions (
          user_id,
          token
       ) VALUES ($1, $2)`,
      [user_id, token],
    );

    return token;
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async destroy({ token }) {
    await db.transaction(async (client) => {
      var sessionTokenResult = await client.query(
        `SELECT token FROM sessions WHERE token = $1`,
        [token],
      );

      var sessionToken = sessionTokenResult.rows[0]?.token;

      if (sessionToken) {
        await client.query(`INSERT INTO revoked_tokens (token) VALUES ($1)`, [
          sessionToken,
        ]);
        await client.query(`DELETE FROM sessions WHERE token = $1`, [
          sessionToken,
        ]);
      } else {
        throw new Error("session_not_found");
      }
    });
  }
}

export var sessionsRepo = new SessionsRepo(db);
