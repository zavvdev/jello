import "server-only";

import { db } from "~/infra/database";
import { createDtoSchema } from "./schemas";

export class SessionsRepo {
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
      `INSERT INTO sessions (
          user_id,
          token
       ) VALUES ($1, $2)`,
      [validDto.user_id, validDto.token],
    );
  }
}

export var sessionsRepo = new SessionsRepo(db);
