const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const getRandomLoot = require('../../utilities/getRandomLoot');
const { fishing } = require('../../data/loot.json');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'fish',
    description: 'Try catching a fish!',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const lootItem = await getRandomLoot(fishing);
            const user = await userData.findOne({ id: interaction.user.id });

            if (!user) {
                user = new userData({
                    id: interaction.user.id,
                    purse_balance: 0,
                    bank_balance: 0,
                    inventory: [],
                });
                await user.save();
                await errorHandler({
                    interaction: interaction,
                    errorType: 'nonExistentUser',
                    commandName: module.exports.name,
                });
                return;
            }
            const lootObj = { item: lootItem, amount: 1 };
            const itemIndex = await user.inventory.findIndex((invItem) => invItem.item === lootObj.item);
            if (itemIndex > -1) {
                user.inventory[itemIndex].amount = user.inventory[itemIndex].amount + lootObj.amount;
            } else {
                await user.inventory.push(lootObj);
            }

            await user.save();

            const embed = await embedBuilder('fish', `${module.exports.module}`, [lootItem]);
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
