/**
 * @param {import("pg").Client} client
 */
function m1745598915285_add_created_by_column_for_tasks(client) {
  return client.query(`
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS created_by INT
    REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL  
  `);
}

module.exports = {
  m1745598915285_add_created_by_column_for_tasks,
};
