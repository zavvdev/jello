import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { db } from "~/core/infrastructure/database";

export class ListsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  board_id: number;
   * }} param0
   */
  async getAll({ board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT l.*, (
          SELECT COALESCE(
            json_agg(t ORDER BY t.order_index ASC, t.created_at ASC), '[]'
          )
          FROM tasks AS t
          WHERE t.list_id = l.id
        ) AS tasks
        FROM lists AS l
        WHERE board_id = $1
        ORDER BY order_index ASC, created_at ASC`,
        [board_id],
      );
      return E.right(result.rows || []);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  board_id: number;
   * }} param0
   */
  async getGreatestOrderIndex({ board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT order_index FROM lists
        WHERE board_id = $1
        ORDER BY order_index DESC
        LIMIT 1`,
        [board_id],
      );
      var index = result.rows[0]?.order_index || 0;
      return E.right({ order_index: index });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  board_id: number;
   *  name: string;
   *  order_index?: number;
   * }} param0
   */
  async create({ board_id, name, order_index }) {
    try {
      await this.#client.query(
        `INSERT INTO lists (name, board_id, order_index)
        VALUES ($1, $2, $3)`,
        [name, board_id, order_index ?? 0],
      );
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  id: number;
   *  name?: string;
   *  order_index?: string;
   * }} param0
   */
  async update({ id, name, order_index }) {
    try {
      await this.#client.query(
        `UPDATE lists SET
        name = COALESCE($1, lists.name),
        order_index = COALESCE($2, lists.order_index)
        WHERE id = $3`,
        [name || null, order_index ?? null, id],
      );
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  id: number;
   * }} param0
   */
  async delete({ id }) {
    try {
      await this.#client.query(`DELETE FROM lists WHERE id = $1`, [
        id,
      ]);
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  ids: number[];
   *  board_id: number;
   * }} param0
   */
  async belongToBoard({ ids, board_id }) {
    try {
      var res = await this.#client.query(
        `SELECT board_id FROM lists
        WHERE id = ANY($1) GROUP BY board_id`,
        [ids],
      );

      if (res.rowCount === 1 && res.rows[0].board_id === board_id) {
        return E.right();
      }

      return E.left(
        Result.of({
          message: MESSAGES.listNotInBoard,
        }),
      );
    } catch {
      return E.left();
    }
  }
}

export var listsRepo = new ListsRepo({
  query: db.query,
});
