var db = require("./connect");
var { sortMigrations } = require("./utilities");

var {
  m1745598509618_remove_is_archived_column_from_tasks,
} = require("./migrations/m1745598509618_remove_is_archived_column_from_tasks");

var {
  m1745598585244_remove_is_archived_column_from_lists,
} = require("./migrations/m1745598585244_remove_is_archived_column_from_lists");

var {
  m1745598654965_add_order_index_column_for_lists,
} = require("./migrations/m1745598654965_add_order_index_column_for_lists");

var {
  m1745598712703_remove_description_column_from_lists,
} = require("./migrations/m1745598712703_remove_description_column_from_lists");

var {
  m1745598790538_add_order_index_column_for_tasks,
} = require("./migrations/m1745598790538_add_order_index_column_for_tasks");

var {
  m1745598915285_add_created_by_column_for_tasks,
} = require("./migrations/m1745598915285_add_created_by_column_for_tasks");

/**
 * @typedef {(client: import("pg").Client) => Promise<QueryResult<any>>} MigrationFn
 */

/**
 * @type {MigrationFn[]}
 */
var migrations = [
  m1745598509618_remove_is_archived_column_from_tasks,
  m1745598585244_remove_is_archived_column_from_lists,
  m1745598654965_add_order_index_column_for_lists,
  m1745598712703_remove_description_column_from_lists,
  m1745598790538_add_order_index_column_for_tasks,
  m1745598915285_add_created_by_column_for_tasks,
];

/**
 * @param {MigrationFn[]} migrations
 */
function main(migrations) {
  return db.transaction(async (client) => {
    for (const migration of sortMigrations(migrations)) {
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
