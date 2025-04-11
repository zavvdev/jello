/**
 * @param {import("pg").Client} client
 */
function m3_add_order_index_column_for_lists(client) {
  return client.query(`
    ALTER TABLE lists
    ADD COLUMN IF NOT EXISTS order_index INT NOT NULL DEFAULT 0
  `);
}

module.exports = {
  m3_add_order_index_column_for_lists,
};
