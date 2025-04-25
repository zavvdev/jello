var MigrationName = {
  create: (name) => `m${new Date().getTime()}_${name}`,
  getTimestamp: (createdName) => {
    var time = Number(createdName.split("_")[0].slice(1));
    if (Number.isNaN(time)) {
      throw new Error("Invalid migration name");
    }
    return time;
  },
};

module.exports = {
  MigrationName,
};
