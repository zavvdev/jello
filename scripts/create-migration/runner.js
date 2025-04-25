var fs = require("node:fs");

var {
  error,
  success,
  appendLineToFile,
  replaceLineInFile,
} = require("../utilities");

var {
  getMigrationTemplate,
  getMigrationImportTemplate,
  getMigrationIncludeTemplate,
  getMigrationInitialIncludeTemplate,
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

    appendLineToFile({
      path: MIGRATE_FILE,
      match: new RegExp(/^\/\/ @migrations/),
      content: getMigrationImportTemplate({ fileName: FILE_NAME }),
    });

    appendLineToFile({
      path: MIGRATE_FILE,
      match: new RegExp(/^var migrations = \[$/),
      content: getMigrationIncludeTemplate({ fileName: FILE_NAME }),
    });

    replaceLineInFile({
      path: MIGRATE_FILE,
      match: "var migrations = [];",
      content: getMigrationInitialIncludeTemplate({
        fileName: FILE_NAME,
      }),
    });

    success();
  } else {
    throw new Error("Provide migration name");
  }
} catch (e) {
  error(e.message);
}
