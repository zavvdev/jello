import "server-only";

import { db } from "~/infra/database";
import { getAllDtoSchema } from "./schemas";

export class BoardsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  async getActive(dto) {
    var { userId } = getAllDtoSchema.request.validateSync(dto, {
      strict: true,
    });

    var result = await this.#client.query(
      `SELECT * FROM boards l 
       INNER JOIN users_boards_roles r ON l.id = r.board_id
       WHERE r.user_id = $1`,
      [userId],
    );

    return getAllDtoSchema.response.validateSync(result.rows, { strict: true });
  }
}

export var boardsRepo = new BoardsRepo(db);
