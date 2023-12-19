const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'uptime',
    description: 'Gets the bots uptime',
    module: 'core',
    
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {

            const days = await Math.floor(polaris.uptime / 86400000);
            const hours = await Math.floor(polaris.uptime / 3600000) % 24;
            const minutes = await Math.floor(polaris.uptime / 60000) % 60;
            const seconds = await Math.floor(polaris.uptime / 1000) % 60;

            const embed = await embedBuilder('uptime', `${module.exports.module}`,[days, hours, minutes, seconds])
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
