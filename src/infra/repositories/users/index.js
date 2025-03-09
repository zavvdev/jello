import "server-only";

import { db } from "~/infra/database";
import { comparePasswords, hashPassword } from "~/infra/encryption/password";
import {
  createDtoSchema,
  existsDtoSchema,
  getByCredentialsDtoSchema,
  getBySessionTokenDtoSchema,
} from "./schemas";

export class UsersRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  async create(dto) {
    var validDto = createDtoSchema.request.validateSync(dto, { strict: true });
    var hashedPassword = await hashPassword(validDto.password);

    await this.#client.query(
      `INSERT INTO users (
          username, 
          first_name, 
          last_name, 
          email, 
          password
       ) VALUES ($1, $2, $3, $4, $5)`,
      [
        validDto.username,
        validDto.first_name,
        validDto.last_name,
        validDto.email,
        hashedPassword,
      ],
    );
  }

  async exists(dto) {
    var { username, email } = existsDtoSchema.request.validateSync(dto, {
      strict: true,
    });

    var existsByUsername = await this.#client.query(
      `SELECT id FROM users WHERE username = $1`,
      [username],
    );

    var existsByEmail = await this.#client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    return existsDtoSchema.response.validateSync(
      {
        byUsername: existsByUsername.rows.length > 0,
        byEmail: existsByEmail.rows.length > 0,
      },
      { strict: true },
    );
  }

  async getByCredentials(dto) {
    var { usernameOrEmail, password } =
      getByCredentialsDtoSchema.request.validateSync(dto, { strict: true });

    var result = await this.#client.query(
      `SELECT id, password FROM users WHERE username = $1 OR email = $1`,
      [usernameOrEmail],
    );

    var user = result.rows[0];

    if (!user || !(await comparePasswords(password, user.password))) {
      return null;
    }

    return getByCredentialsDtoSchema.response.validateSync(
      { id: user.id },
      { strict: true },
    );
  }

  async getBySessionToken(dto) {
    var { token } = getBySessionTokenDtoSchema.request.validateSync(dto, {
      strict: true,
    });

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

    return getBySessionTokenDtoSchema.response.validateSync(result.rows[0], {
      strict: true,
    });
  }
}

export var usersRepo = new UsersRepo(db);
