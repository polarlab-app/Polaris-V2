const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'ragey',
    description: 'ragey',
    module: 'core',
    
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            console.log('test')
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
};
