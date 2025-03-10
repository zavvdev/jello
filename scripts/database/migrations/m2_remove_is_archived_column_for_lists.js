/**
 * @param {import("pg").Client} client
 */
function m2_remove_is_archived_column_for_lists(client) {
  return client.query(`
    ALTER TABLE lists
    DROP COLUMN is_archived;
  `);
}

module.exports = {
  m2_remove_is_archived_column_for_lists,
};
