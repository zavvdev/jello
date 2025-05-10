function m1745598915285_add_created_by_column_for_tasks() {
  return {
    /**
     * @param {import("pg").Client} client
     */
    up: (client) => {
      return client.query(`
        ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS created_by INT
        REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL
      `);
    },
    /**
     * @param {import("pg").Client} client
     */
    down: (client) => {
      return client.query(`
        ALTER TABLE tasks
        DROP COLUMN IF EXISTS created_by
      `);
    },
  };
}

module.exports = {
  m1745598915285_add_created_by_column_for_tasks,
};
