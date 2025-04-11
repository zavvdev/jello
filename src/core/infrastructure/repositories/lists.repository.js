import { Either as E } from "jello-fp";
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
        `SELECT * FROM lists WHERE board_id = $1`,
        [board_id],
      );
      return E.right(result.rows || []);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  name: string;
   *  board_id: number;
   * }} param0
   */
  async create({ name, board_id }) {
    try {
      await this.#client.query(
        `INSERT INTO lists (name, board_id)
        VALUES ($1, $2)`,
        [name, board_id],
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
}

export var listsRepo = new ListsRepo({
  query: db.query,
});
