function m1745598509618_remove_is_archived_column_from_tasks() {
  return {
    /**
     * @param {import("pg").Client} client
     */
    up: (client) => {
      return client.query(`
        ALTER TABLE tasks
        DROP COLUMN IF EXISTS is_archived
      `);
    },
    /**
     * @param {import("pg").Client} client
     */
    down: (client) => {
      return client.query(`
        ALTER TABLE tasks
        ADD COLUMN IF NOT EXISTS is_archived BOOL NOT NULL DEFAULT FALSE
      `);
    },
  };
}

module.exports = {
  m1745598509618_remove_is_archived_column_from_tasks,
};
