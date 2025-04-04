import pg from "pg";
import { crashReportService } from "~/core/infrastructure/services/crash-report.service";
import { CONNECTION } from "./config";

var { Pool } = pg;

var pool = new Pool(CONNECTION);

/**
 * @param {string} text
 * @param {any[]} params
 */
async function query(text, params) {
  return await pool.query(text, params);
}

/**
 * Use this function whenever you need to execute multiple queries in a transaction.
 * Create a repository instance with the client passed as an argument to executor.
 * It ensures that all queries are executed in a single transaction.
 * Custom error handling does not affect this transaction since it tracks the error
 * from the client itself.
 *
 * For example, if you have a try-catch block around your repository method and
 * after cathing the error you return Either.left, then the transaction will also
 * be rolled back.
 *
 * @template T
 * @param {(client: import("pg").Client) => Promise<T>} executor
 * @param {(error: any) => void} onError
 */
async function transaction(executor, onError) {
  try {
    var client = await pool.connect();
    await client.query("BEGIN");
    var result = await executor(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    onError?.(e);

    crashReportService.report({
      message: e.message,
      location: "db.transaction",
      error: e,
    });

    throw e;
  } finally {
    client.release();
  }
}

export var db = {
  query,
  transaction,
};
