import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { encryptionService } from "~/core/infrastructure/services/encryption.service";
import { Result } from "~/core/domain/result";

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

      return E.right({ token });
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
      await this.#client.query(
        `DELETE FROM sessions WHERE token = $1`,
        [token],
      );
      return E.right({ token });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async exists({ token }) {
    try {
      var sessionTokenResult = await this.#client.query(
        `SELECT token FROM sessions WHERE token = $1`,
        [token],
      );

      var sessionToken = sessionTokenResult.rows[0]?.token;

      if (!sessionToken) {
        return E.left(Result.of({ message: MESSAGES.notFound }));
      }

      return E.right({ token: sessionToken });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async revoke({ token }) {
    try {
      await this.#client.query(
        `INSERT INTO revoked_tokens (token) VALUES ($1)`,
        [token],
      );
      return E.right({ token });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async isNotRevoked({ token }) {
    try {
      var result = await this.#client.query(
        "SELECT token from revoked_tokens WHERE token = $1",
        [token],
      );

      if (result.rows.length > 0) {
        return E.left(Result.of({ message: MESSAGES.unauthorized }));
      }

      return E.right({ token });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   */
  async getValid({ token }) {
    try {
      var result = await this.#client.query(
        "SELECT user_id FROM sessions WHERE token = $1 AND expires_at > NOW()",
        [token],
      );

      var user_id = result.rows[0]?.user_id;

      if (!user_id) {
        return E.left(Result.of({ message: MESSAGES.notFound }));
      }

      return E.right({ user_id });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  user_id: number;
   * }} param0
   */
  async getActiveSessions({ user_id }) {
    try {
      var result = await this.#client.query(
        `SELECT token FROM sessions
        WHERE user_id = $1 AND expires_at > NOW()`,
        [user_id],
      );
      return E.right(result.rows);
    } catch {
      return E.left();
    }
  }
}

export var sessionsRepo = new SessionsRepo({
  query: db.query,
});
