import { Either as E } from "jello-fp";
import { db } from "~/core/infrastructure/database";

export class LabelsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  name: string;
   *  color: string;
   *  board_id: number;
   * }} param0
   */
  async create({ name, color, board_id }) {
    try {
      await this.#client.query(
        `INSERT INTO labels (name, color, board_id)
        VALUES ($1, $2, $3)`,
        [name, color, board_id],
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
   *  color?: string;
   * }} param0
   */
  async update({ id, name, color }) {
    try {
      await this.#client.query(
        `UPDATE labels SET
        name = COALESCE($1, labels.name),
        color = COALESCE($2, labels.color)
        WHERE id = $3`,
        [name || null, color || null, id],
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
      await this.#client.query(`DELETE FROM labels WHERE id = $1`, [
        id,
      ]);
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  board_id: number;
   * }} param0
   */
  async getAll({ board_id }) {
    try {
      var result = await this.#client.query(
        `SELECT * FROM labels WHERE board_id = $1`,
        [board_id],
      );
      return E.right(result.rows || []);
    } catch {
      return E.left();
    }
  }
}

export var labelsRepo = new LabelsRepo({
  query: db.query,
});
