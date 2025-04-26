import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { db } from "~/core/infrastructure/database";

export class TasksRepo {
  /**
   * @type {import("pg").Client}
   */
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * @param {{
   *  list_id: number;
   *  name: string;
   *  description: string;
   *  order_index?: number;
   *  user_id: number;
   * }} param0
   */
  async create({ list_id, name, description, order_index, user_id }) {
    try {
      var res = await this.#client.query(
        `INSERT INTO tasks (name, description, list_id, order_index, created_by)
        VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [name, description, list_id, order_index ?? 0, user_id],
      );

      var task_id = res.rows?.[0]?.id;

      if (!task_id) {
        return E.left();
      }

      return E.right({ task_id });
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   *  user_id: number;
   * }} param0
   */
  async assignUser({ task_id, user_id }) {
    try {
      await this.#client.query(
        `INSERT INTO users_tasks (user_id, task_id)
        VALUES ($1, $2)`,
        [user_id, task_id],
      );
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   *  label_id: number;
   * }} param0
   */
  async assignLabel({ task_id, label_id }) {
    try {
      await this.#client.query(
        `INSERT INTO tasks_labels (task_id, label_id)
        VALUES ($1, $2)`,
        [task_id, label_id],
      );
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   * }} param0
   */
  async delete({ task_id }) {
    try {
      await this.#client.query(`DELETE FROM tasks WHERE id = $1`, [
        task_id,
      ]);
      return E.right();
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   * }} param0
   */
  async get({ task_id }) {
    try {
      var res = await this.#client.query(
        `SELECT * FROM tasks WHERE id = $1`,
        [task_id],
      );

      var task = res.rows?.[0];

      if (!task) {
        return E.left(
          Result.of({
            message: MESSAGES.notFound,
          }),
        );
      }

      return E.right(task);
    } catch {
      return E.left();
    }
  }

  /**
   * @param {{
   *  task_id: number;
   * }} param0
   */
  async getBoard({ task_id }) {
    try {
      var res = await this.#client.query(
        `SELECT r.board_id FROM tasks l
        INNER JOIN lists r ON l.list_id = r.id
        WHERE l.id = $1`,
        [task_id],
      );

      var data = res.rows?.[0];

      if (!data) {
        return E.left(
          Result.of({
            message: MESSAGES.notFound,
          }),
        );
      }

      return E.right({ board_id: data.board_id });
    } catch {
      return E.left();
    }
  }
}

export var tasksRepo = new TasksRepo({
  query: db.query,
});
