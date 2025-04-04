import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { encryptionService } from "~/core/infrastructure/services/encryption.service";
import { Result } from "~/core/domain/result";

export class UsersRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  username: string;
   *  first_name: string;
   *  last_name: string;
   *  email: string;
   *  password: string;
   * }} param0
   */
  async create({ username, first_name, last_name, email, password }) {
    try {
      var hashedPassword = await encryptionService.hash(password);

      await this.#client.query(
        `INSERT INTO users (
          username, 
          first_name, 
          last_name, 
          email, 
          password
       ) VALUES ($1, $2, $3, $4, $5)`,
        [username, first_name, last_name, email, hashedPassword],
      );

      return E.right();
    } catch {
      E.left();
    }
  }

  /**
   * @param {{
   *  usernameOrEmail: string;
   *  password: string;
   * }} param0
   */
  async getByCredentials({ usernameOrEmail, password }) {
    try {
      var result = await this.#client.query(
        `SELECT id, password FROM users WHERE username = $1 OR email = $1`,
        [usernameOrEmail],
      );

      var user = result.rows[0];

      if (
        !user ||
        !(await encryptionService.compareHashes(
          password,
          user.password,
        ))
      ) {
        return E.left(
          Result.of({
            message: MESSAGES.invalidCredentials,
          }),
        );
      }

      return E.right({ user_id: user.id });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  username: string;
   * }} param0
   */
  async isUsernameAvailable({ username }) {
    try {
      var result = await this.#client.query(
        `SELECT id FROM users WHERE username = $1`,
        [username],
      );

      if (result.rows.length > 0) {
        return E.left(
          Result.of({ message: MESSAGES.usernameExists }),
        );
      }

      return E.right({ username });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  email: string;
   * }} param0
   */
  async isEmailAvailable({ email }) {
    try {
      var result = await this.#client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );

      if (result.rows.length > 0) {
        return E.left(Result.of({ message: MESSAGES.emailExists }));
      }

      return E.right({ email });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  user_id: number;
   * }} param0
   */
  async get({ user_id }) {
    try {
      var result = await this.#client.query(
        `SELECT
        id, first_name, last_name, username, email, bio, created_at, updated_at
        FROM users WHERE id = $1`,
        [user_id],
      );

      var user = result.rows[0];

      if (!user) {
        return E.left(Result.of({ message: MESSAGES.notFound }));
      }

      return E.right(user);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  user_id: number;
   *  username: string;
   * }} param0
   */
  async searchByUsername({ user_id, username }) {
    try {
      var result = await this.#client.query(
        `SELECT id, username, first_name, last_name FROM users
        WHERE id != $1 AND username ILIKE '%' || $2 || '%'`,
        [user_id, username],
      );
      return E.right(result.rows);
    } catch {
      return E.left();
    }
  }
}

export var usersRepo = new UsersRepo({
  query: db.query,
});
