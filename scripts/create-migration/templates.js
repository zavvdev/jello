var getMigrationTemplate = ({ fileName }) => {
  return `function ${fileName}() {
  return {
    /**
     * @param {import("pg").Client} client
     */
    up: (client) => {
      return client.query(

      );
    },
    /**
     * @param {import("pg").Client} client
     */
    down: (client) => {
      return client.query(

      );
    },
  };
}

module.exports = {
  ${fileName},
};
`;
};

var getMigrationImportTemplate = ({ fileName }) => {
  return `
var {
  ${fileName},
} = require("./migrations/${fileName}");`;
};

var getMigrationIncludeTemplate = ({ fileName }) => {
  return `  ${fileName},`;
};

var getMigrationInitialIncludeTemplate = ({ fileName }) => {
  return `var migrations = [
  ${fileName},
];`;
};

module.exports = {
  getMigrationTemplate,
  getMigrationImportTemplate,
  getMigrationIncludeTemplate,
  getMigrationInitialIncludeTemplate,
};
