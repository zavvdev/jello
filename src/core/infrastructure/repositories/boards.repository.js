import "server-only";

import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { db } from "~/core/infrastructure/database";
import { SORT_ORDER } from "~/core/infrastructure/database/config";
import { Result } from "~/core/domain/result";

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
        `SELECT l.*, r2.role, TRUE AS is_favorite FROM boards l
       INNER JOIN users_starred_boards r ON l.id = r.board_id
       INNER JOIN users_boards_roles r2 ON l.id = r2.board_id
       WHERE r.user_id = $1
       ORDER BY l.updated_at DESC`,
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
        `SELECT l.*, r.role, EXISTS (
            SELECT 1 
            FROM users_starred_boards usb 
            WHERE usb.board_id = l.id
            AND usb.user_id = $1
         ) AS is_favorite FROM boards l
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

  /**
   * @param {{
   *  user_id: number;
   *  board_id: number;
   * }} param0
   */
  async starBoard({ user_id, board_id }) {
    try {
      await this.#client.query(
        `INSERT INTO users_starred_boards (user_id, board_id)
          VALUES ($1, $2)`,
        [user_id, board_id],
      );

      return E.right();
    } catch {
      return E.left();
    }
  }

  async unstarBoard({ user_id, board_id }) {
    try {
      await this.#client.query(
        `DELETE FROM users_starred_boards
          WHERE user_id = $1 AND board_id = $2`,
        [user_id, board_id],
      );

      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  user_id: number;
   *  board_id: number;
   * }} param0
   */
  async getStarredBoardsCount({ user_id, board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT COUNT(*) FROM users_starred_boards
          WHERE user_id = $1 AND board_id = $2`,
        [user_id, board_id],
      );

      return E.right(parseInt(result.rows?.[0]?.count || "0"));
    } catch {
      return E.left();
    }
  }

  async userHasBoard({ user_id, board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT COUNT(*) FROM users_boards_roles
          WHERE user_id = $1 AND board_id = $2`,
        [user_id, board_id],
      );

      return E.right(parseInt(result.rows?.[0]?.count || "0") > 0);
    } catch {
      return E.left();
    }
  }

  async destroy({ board_id }) {
    try {
      await this.#client.query(`DELETE FROM boards WHERE id = $1`, [
        board_id,
      ]);
      return E.right();
    } catch {
      return E.left();
    }
  }

  async getUserRole({ user_id, board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT role FROM users_boards_roles
          WHERE user_id = $1 AND board_id = $2`,
        [user_id, board_id],
      );

      if (result.rows.length === 0) {
        return E.left(Result.of({ message: MESSAGES.notFound }));
      }

      return E.right(result.rows?.[0]?.role);
    } catch {
      return E.left();
    }
  }
}

export var boardsRepo = new BoardsRepo(db);
