import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { encryptionService } from "~/core/infrastructure/services/encryption.service";
import { Result } from "~/core/domain/result";
import { MESSAGE_BY_CONSTRAINT } from "../database/config";
import { handleConstraintError } from "../database/utilities";

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
    } catch (e) {
      return E.left(
        handleConstraintError(MESSAGE_BY_CONSTRAINT.users)(e),
      );
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

  /**
   * @param {{
   *  user_id: number;
   *  first_name: string;
   *  last_name: string;
   *  username: string;
   *  email: string;
   *  bio: string;
   * }} param0
   */
  async update({
    user_id,
    first_name,
    last_name,
    username,
    email,
    bio,
  }) {
    try {
      await this.#client.query(
        `UPDATE users SET
        first_name = COALESCE($1, users.first_name),
        last_name = COALESCE($2, users.last_name),
        username = COALESCE($3, users.username),
        email = COALESCE($4, users.email),
        bio = COALESCE($5, users.bio)
        WHERE id = $6`,
        [
          first_name ?? null,
          last_name ?? null,
          username ?? null,
          email ?? null,
          bio ?? null,
          user_id,
        ],
      );
      return E.right();
    } catch (e) {
      return E.left(
        handleConstraintError(MESSAGE_BY_CONSTRAINT.users)(e),
      );
    }
  }

  /**
   * @param {{
   *  user_id: number;
   *  password: string;
   * }} param0
   */
  async updatePassword({ user_id, password }) {
    try {
      var hashedPassword = await encryptionService.hash(password);

      await this.#client.query(
        `UPDATE users SET
        password = $1
        WHERE id = $2`,
        [hashedPassword, user_id],
      );

      return E.right({ user_id });
    } catch {
      return E.left();
    }
  }
}

export var usersRepo = new UsersRepo({
  query: db.query,
});
