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

module.exports = {
  sortMigrations,
};
