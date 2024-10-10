const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const getRandomLoot = require('../../utilities/getRandomLoot');
const { hunting } = require('../../data/loot.json');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'hunt',
    description: 'Try hunting in the forest for loot!',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await userData.findOne({ id: interaction.user.id });
            const lootItem = await getRandomLoot(hunting);

            const lootObj = { item: lootItem, amount: 1 };
            const itemIndex = user.economy.inventory.findIndex((invItem) => invItem.item === lootObj.item);
            if (itemIndex > -1) {
                user.economy.inventory[itemIndex].amount = user.economy.inventory[itemIndex].amount + lootObj.amount;
            } else {
                await user.inventory.push(lootObj);
            }

            await user.save();

            const embed = await embedBuilder('hunt', `${module.exports.module}`, [lootItem]);
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
