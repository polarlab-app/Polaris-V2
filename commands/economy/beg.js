const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const generateRandomNumber = require('../../utilities/generateRandomNumber');

module.exports = {
    name: 'beg',
    description: 'Beg for items from strangers',
    module: 'economy',
    
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const loot = await generateRandomNumber(300, 9000)
            const embed = await embedBuilder('beg', `${module.exports.module}`,[loot])
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
