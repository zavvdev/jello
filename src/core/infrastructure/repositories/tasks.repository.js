import { Either as E } from "jello-fp";
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
   * }} param0
   */
  async create({ list_id, name, description, order_index }) {
    try {
      var res = await this.#client.query(
        `INSERT INTO tasks (name, description, list_id, order_index)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [name, description, list_id, order_index ?? 0],
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
        `INSERT INTO users_tasks (user_id, task_id)`,
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
        `INSERT INTO tasks_labels (task_id, label_id)`,
        [task_id, label_id],
      );
      return E.right();
    } catch {
      return E.left();
    }
  }
}

export var tasksRepo = new TasksRepo({
  query: db.query,
});
