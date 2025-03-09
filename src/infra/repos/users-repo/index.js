import "server-only";

import { db } from "~/infra/database";
import { comparePasswords, hashPassword } from "~/infra/encryption/password";
import {
  createDtoSchema,
  existsDtoSchema,
  getByCredentialsDtoSchema,
} from "./schemas";

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
   *  username: string,
   *  first_name: string,
   *  last_name: string,
   *  email: string,
   *  password: string
   * }} dto
   */
  async create(dto) {
    var validDto = createDtoSchema.validateSync(dto, { strings: true });
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

  /**
   * @param {{ username: string, email: string }} dto
   */
  async exists(dto) {
    var { username, email } = existsDtoSchema.validateSync(dto, {
      strings: true,
    });

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
   * @param {{ usernameOrEmail: string, password: string }} dto
   * @returns {Promise<{ id: number } | null>}
   */
  async getByCredentials(dto) {
    var { usernameOrEmail, password } = getByCredentialsDtoSchema.validateSync(
      dto,
      { strings: true },
    );

    var result = await this.#client.query(
      `SELECT id, password FROM users WHERE username = $1 OR email = $1`,
      [usernameOrEmail],
    );

    var user = result.rows[0];

    if (!user || !(await comparePasswords(password, user.password))) {
      return null;
    }

    return { id: user.id };
  }
}

export var usersRepo = new UsersRepo(db);
