/**
 * @param {import("pg").Client} client
 */
function m5_add_order_index_column_for_tasks(client) {
  return client.query(`
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS order_index INT NOT NULL DEFAULT 0
  `);
}

module.exports = {
  m5_add_order_index_column_for_tasks,
};
