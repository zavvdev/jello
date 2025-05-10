var { MigrationName } = require("../create-migration/utilities");

var sortMigrations = (migrations) => {
  var next = [...migrations];

  next.sort((a, b) => {
    return (
      MigrationName.getTimestamp(a.name) -
      MigrationName.getTimestamp(b.name)
    );
  });

  return next;
};

var filterMigrations = (migrations) => (filter) =>
  migrations.filter((m) => filter.find((x) => m.name.includes(x)));

var getMigrationFlags = (args) => {
  var filter = args
    .find((arg) => arg.startsWith("--filter="))
    ?.split("=")[1]
    ?.split(",")
    ?.map((arg) => arg.trim())
    ?.filter(Boolean);

  return {
    mode: args.includes("--rollback=true") ? "down" : "up",
    filter,
  };
};

module.exports = {
  sortMigrations,
  filterMigrations,
  getMigrationFlags,
};
