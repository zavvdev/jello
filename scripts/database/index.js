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
 * @param {(client: import("pg").Client) => Promise<void>} executor
 */
async function transaction(executor) {
  try {
    var client = await pool.connect();
    await client.query("BEGIN");
    await executor(client);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export var db = {
  transaction,
};
