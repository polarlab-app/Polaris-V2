const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'ping',
    description: 'Gets the bots current ping',
    module: 'core',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const ping = await polaris.ws.ping;
            let pingmoji;

            if (ping < 120) {
                pingmoji = '<:green:1127508369729671229>';
            } else if (ping < 300) {
                pingmoji = '<:gold:1163487401574924338>';
            } else {
                pingmoji = '<:red:1127513643857227856>';
            }

            const embed = await embedBuilder('ping', `${module.exports.module}`, [ping, pingmoji]);
            await interaction.editReply({ embeds: [embed] });
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
