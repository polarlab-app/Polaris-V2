const embedBuilder = require('../../creators/embeds/embedBuilder');
const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');

module.exports = {
    name: 'test',
    description: 'test',
    module: 'core',

    botPermissions: [],
    permissionsRequired: [],

    callback: async (polaris, interaction) => {
        try {
            const embed = await embedBuilder('ping', `${module.exports.module}`,[await polaris.ws.ping])
            await interaction.editReply({embeds: [embed]})
            await consoleLogHandler({
                interaction: interaction,
                commandName: module.exports.name,
                errorType: 'commandRan',
            });
        } catch (error) {
            await errorHandler({
                interaction: interaction,
                errorType: 'generic',
                commandName: module.exports.name,
                error: error,
            });
        }
    },
}