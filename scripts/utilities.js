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

function appendLineToFile({ path, match, content }) {
  var fileContent = fs.readFileSync(path).toString().split("\n");

  if (fileContent?.length > 0) {
    var lineNum =
      fileContent.findIndex((index) => match.test(index)) + 1;

    if (lineNum !== -1) {
      fileContent.splice(lineNum, 0, content);
      fs.writeFileSync(path, fileContent.join("\n"));
    }
  }
}

function replaceLineInFile({ path, match, content }) {
  var fileContent = fs.readFileSync(path).toString().split("\n");

  if (fileContent?.length > 0) {
    var lineNum = fileContent.findIndex((index) => match === index);

    if (lineNum !== -1) {
      fileContent.splice(lineNum, 1, content);
      fs.writeFileSync(path, fileContent.join("\n"));
    }
  }
}

module.exports = {
  error,
  success,
  appendLineToFile,
  replaceLineInFile,
};
