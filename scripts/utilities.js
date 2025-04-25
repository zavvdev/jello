/* eslint-disable no-console */

var fs = require("node:fs");

function error(message) {
  console.error(`(𐄂) Error!`);
  console.error(`Message: ${message}`);
}

function success(message) {
  console.log("(✔) Done!");
  if (message) {
    console.log(message);
  }
}

function appendToFileAfterPattern({ filePath, pattern, content }) {
  var fileContent = fs.readFileSync(filePath).toString().split("\n");

  if (fileContent?.length > 0) {
    var numberOfLineWithPattern =
      fileContent.findIndex((index) => pattern.test(index)) + 1;
    if (numberOfLineWithPattern) {
      fileContent.splice(numberOfLineWithPattern, 0, content);
      fs.writeFileSync(filePath, fileContent.join("\n"));
    } else {
      console.info(
        `Pattern "${pattern}" not found in file "${filePath}"`,
      );
    }
  } else {
    console.info(`File "${filePath}" is empty`);
  }
}

module.exports = {
  error,
  success,
  appendToFileAfterPattern,
};
