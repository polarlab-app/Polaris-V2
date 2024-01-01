const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const getRandomLoot = require('../../utilities/getRandomLoot');
const { digging } = require('../../data/loot.json')

module.exports = {
    name: 'dig',
    description: 'Try digging in the dirt for loot!',
    module: 'economy',
    
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const lootItem = await getRandomLoot(digging).toUpperCase();
            const embed = await embedBuilder('dig', `${module.exports.module}`,[lootItem])
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
