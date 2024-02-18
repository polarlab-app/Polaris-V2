const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'shutdown',
    description: 'Shutdowns the bot',
    module: 'core',

    permissionsRequired: [],
    botPermissions: [],
    devOnly: true,

    callback: async (polaris, interaction) => {
        try {
            const embed = await successEmbedBuilder('shutdown');
            await interaction.editReply({ embeds: [embed] });
            await consoleLogHandler({
                errorType: 'shutdown',
            });
            process.exit();
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
