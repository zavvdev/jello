/**
 * @param {import("pg").Client} client
 */
function m1_remove_is_archived_column_for_tasks(client) {
  return client.query(`
    ALTER TABLE tasks
    DROP COLUMN is_archived;
  `);
}

module.exports = {
  m1_remove_is_archived_column_for_tasks,
};
