var fs = require("node:fs");
var {
  error,
  success,
  appendToFileAfterPattern,
} = require("../utilities");
var { getMigrationTemplate } = require("./templates");
var { MigrationName } = require("./utilities");

try {
  var NAME = process.argv[2].toLowerCase();

  if (NAME) {
    var FILE_NAME = MigrationName.create(NAME);
    var DIR = `scripts/database/migrations`;
    var PATH = `${DIR}/${FILE_NAME}.js`;

    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR);
    }

    fs.appendFile(
      PATH,
      getMigrationTemplate({
        fileName: FILE_NAME,
      }),
      () => {},
    );

    appendToFileAfterPattern({
      filePath: "scripts/database/migrate.js",
      pattern: new RegExp(
        /^(var migrations = \[)|(var migrations = \[])$/,
      ),
      content: `  ${FILE_NAME},`,
    });

    success();
  } else {
    throw new Error("Provide migration name");
  }
} catch (e) {
  error(e.message);
}
