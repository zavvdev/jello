import "server-only";

import { Either as E } from "jello-fp";
import { db } from "~/core/infrastructure/database";
import { SORT_ORDER } from "~/core/infrastructure/database/config";

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
   */
  async getStarred({ user_id }) {
    try {
      var result = await this.#client.query(
        `SELECT l.* FROM boards l
       INNER JOIN users_starred_boards r ON l.id = r.board_id
       WHERE r.user_id = $1`,
        [user_id],
      );

      return E.right(result.rows);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  user_id: number;
   *  role: string;
   *  is_archived: boolean;
   *  search: string;
   *  sort_by: "date" | "name";
   *  sort_order: "asc" | "desc";
   * }} param0
   */
  async getAll({
    user_id,
    role,
    is_archived,
    search,
    sort_by,
    sort_order,
  }) {
    try {
      var orderQueryMap = {
        date: "l.created_at",
        name: "LOWER(l.name)",
      };

      var result = await this.#client.query(
        `SELECT l.* FROM boards l
       INNER JOIN users_boards_roles r ON l.id = r.board_id
       WHERE r.user_id = $1
       AND r.role = COALESCE($2, r.role)
       AND l.is_archived = $3
       AND l.name ILIKE '%' || $4 || '%'
       ORDER BY ${orderQueryMap[sort_by]} ${SORT_ORDER[sort_order]}`,
        [user_id, role, is_archived, search || ""],
      );

      return E.right(result.rows);
    } catch {
      return E.left();
    }
  }
}

export var boardsRepo = new BoardsRepo(db);
