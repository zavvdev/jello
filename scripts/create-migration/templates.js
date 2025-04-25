var getMigrationTemplate = ({ fileName }) =>
  `/**
 * @param {import("pg").Client} client
 */
function ${fileName}(client) {
  return client.query(\`
    
  \`);
}

module.exports = {
  ${fileName},
};
`;

var getMigrationImportTemplate = ({ fileName }) => {
  return `
var {
  ${fileName},
} = require("./migrations/${fileName}");`;
};

var getMigrationIncludeTemplate = ({ fileName }) => {
  return `  ${fileName},`;
};

module.exports = {
  getMigrationTemplate,
  getMigrationImportTemplate,
  getMigrationIncludeTemplate,
};
