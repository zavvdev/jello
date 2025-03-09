import "server-only";

import { db } from "~/infra/database";
import { AuthMiddleware } from "~/infra/middlewares/auth";
import { getAllDtoSchema } from "./schemas";

export class BoardsRepo extends AuthMiddleware {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    super();
    this.#client = client;
  }

  async getAll(user, dto = { withArchived: false }) {
    var { withArchived } = getAllDtoSchema.request.validateSync(dto, {
      strict: true,
    });

    var result = await this.#client.query(
      `SELECT * FROM boards l 
       INNER JOIN users_boards_roles r ON l.id = r.board_id
       WHERE r.user_id = $1 AND l.archived = $2`,
      [user.id, withArchived],
    );

    return getAllDtoSchema.response.validateSync(result.rows, { strict: true });
  }
}

export var boardsRepo = new BoardsRepo(db);
