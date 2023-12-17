const areCommandsDifferent = require('../../utilities/areCommandsDifferent');
const getApplicationCommands = require('../../utilities/getApplicationCommands');
const getLocalCommands = require('../../utilities/getLocalCommands');

const consoleLogHandler = require('../../handlers/consoleLogHandler');
const errorHandler = require('../../handlers/errorHandler');

module.exports = async (polaris) => {
    try {
        await consoleLogHandler({ errorType: 'space' });
        await consoleLogHandler({ errorType: 'commandsRefreshing' });
        await consoleLogHandler({ errorType: 'commandsRegistered' });
        await consoleLogHandler({ errorType: 'space' });

        const localCommands = await getLocalCommands();
        const applicationCommands = await getApplicationCommands(polaris);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                }
            } else {
                if (localCommand.deleted) {
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });
            }
        }
    } catch (error) {
        await errorHandler({ error: error, errorType: 'generic', commandName: '[REGISTER COMMANDS]' });
    }
};
