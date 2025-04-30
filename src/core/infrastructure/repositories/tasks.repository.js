import { Either as E } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { Result } from "~/core/domain/result";
import { db } from "~/core/infrastructure/database";
import { handleConstraintError } from "../database/utilities";
import { MESSAGE_BY_CONSTRAINT } from "../database/config";

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
    } catch (e) {
      return E.left(
        handleConstraintError(MESSAGE_BY_CONSTRAINT.users_tasks)(e),
      );
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

  /**
   * @param {{
   *  id: number;
   *  name: string;
   *  description?: string;
   *  list_id: number;
   *  }} param0
   */
  async update({ id, name, description, list_id }) {
    try {
      await this.#client.query(
        `UPDATE tasks SET name = $1, description = $2, list_id = $3 WHERE id = $4`,
        [name, description || null, list_id, id],
      );
      return E.right();
    } catch (e) {
      return E.left(
        handleConstraintError(MESSAGE_BY_CONSTRAINT.tasks)(e),
      );
    }
  }

  /**
   * @param {{
   *  task_id: number;
   * }} param0
   */
  async getUsers({ task_id }) {
    try {
      var res = await this.#client.query(
        `SELECT r.id, r.username, r.first_name, r.last_name
        FROM users_tasks l
        INNER JOIN users r ON l.user_id = r.id
        WHERE l.task_id = $1`,
        [task_id],
      );

      return E.right(res.rows ?? []);
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
  async removeUsers({ task_id, user_id }) {
    try {
      await this.#client.query(
        `DELETE FROM users_tasks WHERE user_id = $1 AND task_id = $2`,
        [user_id, task_id],
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
