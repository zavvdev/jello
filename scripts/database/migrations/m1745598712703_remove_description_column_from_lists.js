function m1745598712703_remove_description_column_from_lists() {
  return {
    /**
     * @param {import("pg").Client} client
     */
    up: (client) => {
      return client.query(`
        ALTER TABLE lists
        DROP COLUMN IF EXISTS description
      `);
    },
    /**
     * @param {import("pg").Client} client
     */
    down: (client) => {
      return client.query(`
        ALTER TABLE lists
        ADD COLUMN IF NOT EXISTS description VARCHAR(100) DEFAULT NULL
      `);
    },
  };
}

module.exports = {
  m1745598712703_remove_description_column_from_lists,
};
