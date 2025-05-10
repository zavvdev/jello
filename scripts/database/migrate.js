var db = require("./connect");
var {
  sortMigrations,
  filterMigrations,
  getMigrationFlags,
} = require("./utilities");

// @migrations

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
  var { mode, filter } = getMigrationFlags(process.argv);

  if (filter?.length > 0) {
    migrations = filterMigrations(migrations)(filter);
  }

  return db.transaction(async (client) => {
    for (const migration of sortMigrations(migrations)) {
      await migration()[mode](client);
    }
  });
}

main(migrations)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Success.");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Operation failed.", e);
  })
  .finally(() => {
    process.exit();
  });
