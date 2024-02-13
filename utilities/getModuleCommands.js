const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (commandModule, exceptions = []) => {
    let moduleCommands = [];

    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);

    for (const commandCategory of commandCategories) {
        if (path.basename(commandCategory) == commandModule) {
            const commandFiles = getAllFiles(commandCategory);
            for (const commandFile of commandFiles) {
                const commandObject = require(commandFile);

                if (exceptions.includes(commandObject.name)) {
                    continue;
                }

                moduleCommands.push(commandObject);
            }
        } else {
            continue;
        }
    }

    return moduleCommands;
};
