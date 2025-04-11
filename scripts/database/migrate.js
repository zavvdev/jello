var db = require("./index");

var {
  m1_remove_is_archived_column_from_tasks,
} = require("./migrations/m1_remove_is_archived_column_from_tasks");

var {
  m2_remove_is_archived_column_from_lists,
} = require("./migrations/m2_remove_is_archived_column_from_lists");

var {
  m3_add_order_index_column_for_lists,
} = require("./migrations/m3_add_order_index_column_for_lists");

var {
  m4_remove_description_column_from_lists,
} = require("./migrations/m4_remove_description_column_from_lists");

var {
  m5_add_order_index_column_for_tasks,
} = require("./migrations/m5_add_order_index_column_for_tasks");

/**
 * @typedef {(client: import("pg").Client) => Promise<QueryResult<any>>} MigrationFn
 */

/**
 * @type {MigrationFn[]}
 */
var migrations = [
  m1_remove_is_archived_column_from_tasks,
  m2_remove_is_archived_column_from_lists,
  m3_add_order_index_column_for_lists,
  m4_remove_description_column_from_lists,
  m5_add_order_index_column_for_tasks,
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
