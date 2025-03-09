import "server-only";

import { cookies } from "next/headers";
import { createSessionToken } from "~/infra/encryption/session";
import { db } from "~/infra/database";
import { createDtoSchema } from "./schemas";
import { COOKIE_CONFIG } from "./config";

export class SessionsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{ user_id: number }} dto
   */
  async create(dto) {
    var { user_id } = createDtoSchema.validateSync(dto, {
      strings: true,
    });

    var token = createSessionToken();

    await this.#client.query(
      `INSERT INTO sessions (
          user_id,
          token
       ) VALUES ($1, $2)`,
      [user_id, token],
    );

    var cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG(token));
  }

  /**
   * @param {string} token
   */
  async destroy(token) {
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
      }
    });
  }
}

export var sessionsRepo = new SessionsRepo(db);
