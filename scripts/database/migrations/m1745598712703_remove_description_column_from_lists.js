/**
 * @param {import("pg").Client} client
 */
function m1745598712703_remove_description_column_from_lists(client) {
  return client.query(`
    ALTER TABLE lists
    DROP COLUMN IF EXISTS description  
  `);
}

module.exports = {
  m1745598712703_remove_description_column_from_lists,
};
