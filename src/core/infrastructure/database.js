import "server-only";

import pg from "pg";

var { Pool } = pg;

var pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

/**
 * @param {string} text
 * @param {any[]} params
 */
async function query(text, params) {
  return await pool.query(text, params);
}

/**
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
    throw e;
  } finally {
    client.release();
  }
}

export var db = {
  query,
  transaction,
};
