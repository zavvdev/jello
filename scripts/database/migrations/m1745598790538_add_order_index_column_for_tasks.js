function m1745598790538_add_order_index_column_for_tasks() {
  return {
    /**
     * @param {import("pg").Client} client
     */
    up: (client) => {
      return client.query(`
        ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS order_index INT NOT NULL DEFAULT 0
      `);
    },
    /**
     * @param {import("pg").Client} client
     */
    down: (client) => {
      return client.query(`
        ALTER TABLE tasks
        DROP COLUMN IF EXISTS order_index
      `);
    },
  };
}

module.exports = {
  m1745598790538_add_order_index_column_for_tasks,
};
