const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'restart',
    description: 'Restarts the bot',
    module: 'core',

    permissionsRequired: [],
    botPermissions: [],
    devOnly: true,

    callback: async (polaris, interaction) => {
        try {
            const embed = await successEmbedBuilder('reboot');
            await interaction.editReply({ embeds: [embed] });
            await consoleLogHandler({
                errorType: 'restart',
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
