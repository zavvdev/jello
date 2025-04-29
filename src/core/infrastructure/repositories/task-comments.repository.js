import { Either as E } from "jello-fp";
import { db } from "~/core/infrastructure/database";

export class TaskCommentsRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  task_id: number;
   * }} param0
   */
  async getAll({ task_id }) {
    try {
      var res = await this.#client.query(
        `SELECT id, body, task_id, created_at, updated_at, (
          SELECT json_build_object(
            'id', u.id,
            'username', u.username,
            'first_name', u.first_name,
            'last_name', u.last_name
          ) FROM users AS u WHERE u.id = author_id
        ) AS author FROM task_comments
        WHERE task_id = $1`,
        [task_id],
      );

      return E.right(res?.rows || []);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   *  body: string;
   *  author_id: number;
   * }} param0
   */
  async create({ task_id, body, author_id }) {
    try {
      var res = await this.#client.query(
        `INSERT INTO task_comments (task_id, body, author_id)
        VALUES ($1, $2, $3) RETURNING id`,
        [task_id, body, author_id],
      );

      return E.right(res?.rows[0]);
    } catch {
      return E.left();
    }
  }
}

export var taskCommentsRepo = new TaskCommentsRepo({
  query: db.query,
});
