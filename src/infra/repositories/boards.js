import "server-only";

import { db } from "~/infra/database";

export class BoardsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  user_id: number;
   * }} param0
   * @returns {Promise<{
   *  id: number;
   *  name: string;
   *  description: string | null;
   *  color: string;
   *  is_archived: false;
   *  created_at: string;
   *  updated_at: string;
   * }>}
   */
  async getActive({ user_id }) {
    var result = await this.#client.query(
      `SELECT * FROM boards l 
       INNER JOIN users_boards_roles r ON l.id = r.board_id
       WHERE r.user_id = $1 AND l.is_archived = false`,
      [user_id],
    );

    return result.rows;
  }
}

export var boardsRepo = new BoardsRepo(db);
