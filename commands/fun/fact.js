const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const facts = require('../../schemas/facts');

module.exports = {
    name: 'fact',
    description: 'Gets a random Fact',
    module: 'fun',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const embed = await embedBuilder(module.exports.name, module.exports.module, [await polaris.ws.ping]);
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
