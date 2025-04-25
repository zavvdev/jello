/**
 * @param {import("pg").Client} client
 */
function m1745598585244_remove_is_archived_column_from_lists(client) {
  return client.query(`
    ALTER TABLE lists
    DROP COLUMN IF EXISTS is_archived  
  `);
}

module.exports = {
  m1745598585244_remove_is_archived_column_from_lists,
};
