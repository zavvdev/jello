import "server-only";

import { db } from "~/infra/database";
import { AuthMiddleware } from "~/infra/repos/private/auth-middleware";

export class BoardsRepo extends AuthMiddleware {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    super();
    this.#client = client;
  }

  async getAll(user) {
    var result = await this.#client.query(
      `SELECT * FROM boards l 
       INNER JOIN users_boards_roles r ON l.id = r.board_id
       WHERE r.user_id = $1`,
      [user.id],
    );
    return result.rows;
  }
}

export var boardsRepo = new BoardsRepo(db);
