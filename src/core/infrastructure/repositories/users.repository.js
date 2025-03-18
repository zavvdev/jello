import "server-only";

import { db } from "~/core/infrastructure/database";
import { encryptionService } from "~/core/infrastructure/services/encryption.service";

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
  }

  /**
   * @param {{
   *  username: string;
   *  email: string;
   * }} param0
   */
  async exists({ username, email }) {
    var existsByUsername = await this.#client.query(
      `SELECT id FROM users WHERE username = $1`,
      [username],
    );

    var existsByEmail = await this.#client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    return {
      byUsername: existsByUsername.rows.length > 0,
      byEmail: existsByEmail.rows.length > 0,
    };
  }

  /**
   * @param {{
   *  usernameOrEmail: string;
   *  password: string;
   * }} param0
   * @returns {Promise<{
   *  id: number;
   * }>}
   */
  async getByCredentials({ usernameOrEmail, password }) {
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
      return null;
    }

    return { id: user.id };
  }

  /**
   * @param {{
   *  token: string;
   * }} param0
   * @returns {Promise<{
   *  id: number;
   *  first_name: string;
   *  last_name: string;
   *  username: string;
   *  email: string;
   *  bio: string | null;
   *  created_at: string;
   *  updated_at: string;
   * }>}
   */
  async getBySessionToken({ token }) {
    if (!token) {
      return null;
    }

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

    return result.rows[0];
  }
}

export var usersRepo = new UsersRepo(db);
