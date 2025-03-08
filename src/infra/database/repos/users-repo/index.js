import "server-only";

import * as R from "remeda";
import { db } from "~/infra/database";
import { createDtoSchema, existsDtoSchema } from "./schemas";
import { UserSchema } from "~/entity/user";

export class UsersRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  async create(dto) {
    var validDto = createDtoSchema.validateSync(dto, { strings: true });

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
        validDto.password,
      ],
    );

    var user = await this.#client.query(
      `SELECT * FROM users WHERE username = $1`,
      [validDto.username],
    );

    return UserSchema.validateSync(R.omit(user.rows[0], ["password"]));
  }

  async exists(dto) {
    var { username, email } = existsDtoSchema.validateSync(dto, {
      strings: true,
    });

    var existsByUsername = await this.#client.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
    );

    var existsByEmail = await this.#client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );

    return {
      byUsername: existsByUsername.rows.length > 0,
      byEmail: existsByEmail.rows.length > 0,
    };
  }
}

export var usersRepo = new UsersRepo(db);
