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

module.exports = {
  getMigrationTemplate,
};
