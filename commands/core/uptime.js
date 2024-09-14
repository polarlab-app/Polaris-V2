const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'uptime',
    description: 'Gets the bots uptime',
    module: 'core',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const days = Math.floor(polaris.uptime / 86400000);
            const hours = Math.floor(polaris.uptime / 3600000) % 24;
            const minutes = Math.floor(polaris.uptime / 60000) % 60;
            const seconds = Math.floor(polaris.uptime / 1000) % 60;

            const embed = await embedBuilder('uptime', `${module.exports.module}`, [days, hours, minutes, seconds]);
            await interaction.editReply({ embeds: [embed] });
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
