var fs = require("node:fs");

var {
  error,
  success,
  appendToFileAfterPattern,
} = require("../utilities");

var {
  getMigrationTemplate,
  getMigrationImportTemplate,
  getMigrationIncludeTemplate,
} = require("./templates");

var { MigrationName } = require("./utilities");

try {
  var NAME = process.argv[2].toLowerCase();

  if (NAME) {
    var FILE_NAME = MigrationName.create(NAME);
    var DIR = `scripts/database/migrations`;
    var FILE_PATH = `${DIR}/${FILE_NAME}.js`;
    var MIGRATE_FILE = "scripts/database/migrate.js";

    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR);
    }

    fs.appendFile(
      FILE_PATH,
      getMigrationTemplate({
        fileName: FILE_NAME,
      }),
      () => {},
    );

    appendToFileAfterPattern({
      filePath: MIGRATE_FILE,
      pattern: new RegExp(/^\/\/ @migrations/),
      content: getMigrationImportTemplate({ fileName: FILE_NAME }),
    });

    appendToFileAfterPattern({
      filePath: MIGRATE_FILE,
      pattern: new RegExp(/^var migrations = \[/),
      content: getMigrationIncludeTemplate({ fileName: FILE_NAME }),
    });

    success();
  } else {
    throw new Error("Provide migration name");
  }
} catch (e) {
  error(e.message);
}
