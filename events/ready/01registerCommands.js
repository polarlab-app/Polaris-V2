const areCommandsDifferent = require('../../utilities/areCommandsDifferent');
const getApplicationCommands = require('../../utilities/getApplicationCommands');
const getGlobalCommands = require('../../utilities/getGlobalCommands');

const consoleLogHandler = require('../../handlers/consoleLogHandler');
const errorHandler = require('../../handlers/errorHandler');

module.exports = async (polaris) => {
    try {
        await consoleLogHandler({ errorType: 'space' });
        await consoleLogHandler({ errorType: 'commandsRefreshing' });
        await consoleLogHandler({ errorType: 'commandsRegistered' });
        await consoleLogHandler({ errorType: 'space' });

        const globalCommands = await getGlobalCommands();
        const applicationCommands = await getApplicationCommands(polaris);

        for (const globalCommand of globalCommands) {
            const { name, description, options } = globalCommand;
            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

            if (existingCommand) {
                if (globalCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, globalCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                }
            } else {
                if (globalCommand.deleted) {
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
