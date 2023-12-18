const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (module, exceptions = []) => {
  let moduleCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands", `${module}`),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);
    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      moduleCommands.push(commandObject);
    }
  }

  return moduleCommands;
};
