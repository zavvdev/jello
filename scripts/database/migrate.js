var db = require("./index");

var {
  m1_remove_is_archived_column_for_tasks,
} = require("./migrations/m1_remove_is_archived_column_for_tasks");

var {
  m2_remove_is_archived_column_for_lists,
} = require("./migrations/m2_remove_is_archived_column_for_lists");

/**
 * @typedef {(client: import("pg").Client) => Promise<QueryResult<any>>} MigrationFn
 */

/**
 * @type {MigrationFn[]}
 */
var migrations = [
  m1_remove_is_archived_column_for_tasks,
  m2_remove_is_archived_column_for_lists,
];

/**
 * @param {MigrationFn[]} migrations
 */
function main(migrations) {
  return db.transaction(async (client) => {
    for (const migration of migrations) {
      await migration(client);
    }
  });
}

main(migrations)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database migrations completed.");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Error migrating database", e);
  })
  .finally(() => {
    process.exit();
  });
