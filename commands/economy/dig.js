const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const userData = require('../../schemas/userData');
const getRandomLoot = require('../../utilities/getRandomLoot');
const { digging } = require('../../data/loot.json');

module.exports = {
    name: 'dig',
    description: 'Try digging in the dirt for loot!',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const lootItem = await getRandomLoot(digging);
            const user = await userData.findOne({ id: interaction.user.id });

            const lootObj = { item: lootItem, amount: 1 };
            const itemIndex = user.economy.inventory.findIndex((invItem) => invItem.item === lootObj.item);
            if (itemIndex > -1) {
                user.economy.inventory[itemIndex].amount = user.economy.inventory[itemIndex].amount + lootObj.amount;
            } else {
                user.economy.inventory.push(lootObj);
            }

            await user.save();

            const embed = await embedBuilder('dig', `${module.exports.module}`, [lootItem]);
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
