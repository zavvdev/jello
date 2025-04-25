/**
 * @param {import("pg").Client} client
 */
function m1745598509618_remove_is_archived_column_from_tasks(client) {
  return client.query(`
    ALTER TABLE tasks
    DROP COLUMN IF EXISTS is_archived
  `);
}

module.exports = {
  m1745598509618_remove_is_archived_column_from_tasks,
};
