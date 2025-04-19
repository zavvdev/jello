/**
 * @param {import("pg").Client} client
 */
function m4_remove_description_column_from_lists(client) {
  return client.query(`
    ALTER TABLE lists
    DROP COLUMN IF EXISTS description;
  `);
}

module.exports = {
  m4_remove_description_column_from_lists,
};
